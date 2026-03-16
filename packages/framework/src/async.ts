import { component, html, reactive } from '@arrow-js/core'
import type {
  AsyncComponentOptions,
  Component,
  ComponentWithProps,
  Props,
  ReactiveTarget,
} from '@arrow-js/core'
import { getRenderContext, runWithRenderContext } from './context'

type AsyncStatus = 'idle' | 'pending' | 'resolved' | 'rejected'

export function asyncComponent<TValue, TSnapshot = unknown>(
  loader: () => Promise<TValue> | TValue,
  options?: AsyncComponentOptions<ReactiveTarget, TValue, TSnapshot>
): Component
export function asyncComponent<TProps extends ReactiveTarget, TValue, TSnapshot = unknown>(
  loader: (props: Props<TProps>) => Promise<TValue> | TValue,
  options?: AsyncComponentOptions<TProps, TValue, TSnapshot>
): ComponentWithProps<TProps>
export function asyncComponent<TProps extends ReactiveTarget, TValue, TSnapshot = unknown>(
  loader: ((props: Props<TProps>) => Promise<TValue> | TValue) | (() => Promise<TValue> | TValue),
  options: AsyncComponentOptions<TProps, TValue, TSnapshot> = {}
): Component | ComponentWithProps<TProps> {
  let clientComponentIndex = 0

  return component<TProps>((props) => {
    const state = reactive({
      id: '' as string,
      status: 'idle' as AsyncStatus,
      value: null as unknown,
      error: null as unknown,
    })
    let inFlight: Promise<void> | null = null

    const context = getRenderContext()
    const runInContext = <T>(fn: () => T) => runWithRenderContext(context, fn)
    if (!state.id) {
      state.id =
        context?.claimComponentId(options.idPrefix) ??
        `${options.idPrefix ?? 'c'}:client:${clientComponentIndex++}`
    }

    if (state.status === 'idle' && context) {
      const snapshot = context.consumeSnapshot(state.id)
      if (snapshot !== undefined) {
        state.value = options.deserialize
          ? options.deserialize(snapshot as TSnapshot, props)
          : snapshot
        state.status = 'resolved'
      }
    }

    const start = () => {
      if (inFlight) return inFlight

      state.status = 'pending'
      const task = Promise.resolve()
        .then(() =>
          runInContext(() =>
            (loader as (props: Props<TProps>) => Promise<TValue> | TValue)(props)
          )
        )
        .then((value) => {
          runInContext(() => {
            state.value = value
            state.status = 'resolved'
            const snapshot =
              options.serialize?.(value, props) ?? createDefaultSnapshot(value)

            if (context && snapshot !== undefined) {
              context.recordSnapshot(state.id, snapshot)
            }
          })
        })
        .catch((error) => {
          runInContext(() => {
            state.error = error
            state.status = 'rejected'
          })
        })
        .finally(() => {
          inFlight = null
        })

      inFlight = task
      context?.track(task)
      return task
    }

    if (state.status === 'idle') {
      void start()
    }

    return html`${() => {
      if (state.status === 'rejected') {
        if (options.onError) {
          return runInContext(() => options.onError!(state.error, props))
        }
        throw state.error
      }

      if (state.status === 'resolved') {
        return runInContext(() =>
          options.render
            ? options.render(state.value as TValue, props)
            : (state.value as TValue)
        )
      }

      return options.fallback ?? ''
    }}`
  }) as Component | ComponentWithProps<TProps>
}

function createDefaultSnapshot<TValue>(value: TValue) {
  try {
    return JSON.stringify(value) === undefined ? undefined : value
  } catch {
    return undefined
  }
}
