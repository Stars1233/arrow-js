import { component, pick } from './component'
import { html } from './html'
import { reactive, watch } from './reactive'

export {
  component,
  component as c,
  html,
  html as t,
  pick,
  pick as props,
  reactive,
  reactive as r,
  watch,
  watch as w,
}

export { nextTick } from './common'

export type { ArrowTemplate } from './html'

export type {
  AsyncComponentOptions,
  Component,
  ComponentWithProps,
  Props,
} from './component'

export type { Computed, Reactive, ReactiveTarget } from './reactive'
