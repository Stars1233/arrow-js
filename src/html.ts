import { watch } from './reactive'
import { isChunk, isTpl, queue } from './common'
import { setAttr } from './dom'
import {
  expressionPool,
  onExpressionUpdate,
  releaseExpressions,
  storeExpressions,
  updateExpressions,
} from './expressions'
/**
 * An arrow template one of the three primary ArrowJS utilities. Specifically,
 * templates are functions that return a function which mounts the template to
 * a given parent node. However, the template also has some other properties on
 * it like `.key` and `.isT`.
 *
 * The "magic" of an arrow template, is any expressions that are in the template
 * literal are automatically observed for changes. When a change is detected,
 * the bound attributes or textNodes are updated.
 */
export interface ArrowTemplate {
  /**
   * Mounts the template to a given parent node.
   */
  (parent: ParentNode): ParentNode
  (): DocumentFragment
  /**
   * A boolean flag that indicates this is indeed an ArrowTemplate.
   */
  isT: boolean
  /**
   * Adds a key to this template to identify it as a unique instance.
   * @param key - A unique key that identifies this template instance (not index).
   * @returns
   */
  key: (key: ArrowTemplateKey) => ArrowTemplate
  /**
   * Yields the underlying chunk object that is used to render this template.
   * @returns
   * @internal
   */
  _c: () => Chunk
  /**
   * Yield the reactive expressions that are contained within this template.
   * Does not contain the expressions that are are not "reactive".
   * @returns
   * @internal
   */
  _e: number
  /**
   * The template key.
   */
  _k: ArrowTemplateKey
  /**
   * The allowed values for arrow keys.
   */
}

type ArrowTemplateKey = string | number | undefined

/**
 * Types of return values that can be rendered.
 */
export type ArrowRenderable =
  | string
  | number
  | boolean
  | null
  | undefined
  | ArrowTemplate
  | Array<string | number | ArrowTemplate>

/**
 * A reactive function is a function that is bound to a template. It is the
 * higher order control around the expressions that are in the template literal.
 * It is responsible for updating the template when the expression changes.
 */
export interface ReactiveFunction {
  (el?: Node): ArrowRenderable
  // (ev: Event, listener: EventListenerOrEventListenerObject): void
  $on: (observer: ArrowFunction | null) => ArrowFunction | null
  _up: (newExpression: ReactiveFunction) => void
  e: ArrowExpression
  s: boolean
}

/**
 * An array of reactive functions.
 */
export type ReactiveExpressions = {
  /**
   * The index of the currently active expression.
   */
  i: number
  /**
   * An array of the actual expressions.
   */
  e: ReactiveFunction[]
}

/**
 * An internal primitive that is used to e a dom elements.
 */
export interface ArrowFragment {
  <T extends ParentNode>(parent?: T): T extends undefined ? DocumentFragment : T
}

/**
 * A parent node is either an element or a document fragment — something that
 * can have elements appended to it.
 */
export type ParentNode = Node | DocumentFragment

/**
 * A classification of items that can be rendered within the template.
 */
export type RenderGroup =
  | ArrowTemplate
  | ArrowTemplate[]
  | Node
  | Node[]
  | string[]

/**
 * A function that can be used as an arrow expression — always returns a
 * renderable.
 */
export type ArrowFunction = (...args: unknown[]) => ArrowRenderable

/**
 * The possible value of an arrow expression.
 */
export type ArrowExpression =
  | ArrowRenderable
  | ArrowFunction
  | EventListener
  | ((evt: InputEvent) => void)

/**
 * A chunk of HTML with paths to the expressions that are contained within it.
 */
export interface Chunk {
  /**
   * An array of array paths pointing to the expressions that are contained
   * within the HTML of this chunk.
   */
  readonly paths: Array<string | number>[]
  /**
   * A document fragment that contains the HTML of this chunk. Note: this is
   * only populated with nodes until those nodes are mounted.
   */
  dom: DocumentFragment
  /**
   * An array of child nodes that are contained within this chunk. These
   * references stay active even after the nodes are mounted.
   */
  ref: DOMRef
  /**
   * A reference to the template that created this chunk.
   */
  _t: ArrowTemplate
  /**
   * A unique key that identifies this template instance, generally used in
   * list rendering.
   */
  k?: ArrowTemplateKey
  /**
   * Cleanup callbacks for reactive bindings in this chunk.
   */
  u?: Array<() => void> | null
}

type ChunkProto = Pick<Chunk, 'dom' | 'paths'>

/**
 * A reference to the DOM elements mounted by a chunk.
 */
interface DOMRef {
  f: ChildNode | null
  l: ChildNode | null
}

/**
 * A mutable stack of bindings used to create reactive expressions. We
 * initialize this with a large array to avoid memory allocation costs during
 * node creation, and then perform occasional clean up work.
 */
let bindingStackPos = -1
const bindingStack: Array<Node | string | number> = []

/**
 * The delimiter that describes where expressions are located.
 */
const delimiter = '➳❍'
const delimiterComment = `<!--${delimiter}-->`

/**
 * A memo of pathed chunks that have been created.
 */
const chunkMemo: Record<string, ChunkProto> = {}

type Rendered = Chunk | Text | Comment
type InternalTemplate = ArrowTemplate & {
  d?: () => void
  x?: () => void
}

function moveDOMRef(ref: DOMRef, anchor: ChildNode, after?: boolean) {
  const parent = anchor.parentNode
  let node = ref.f
  if (!parent || !node) return
  const last = ref.l
  const target = after ? anchor.nextSibling : anchor
  if (node === last) {
    parent.insertBefore(node, target)
    return
  }
  while (node) {
    const next: ChildNode | null =
      node === last ? null : (node.nextSibling as ChildNode | null)
    parent.insertBefore(node, target)
    if (!next) break
    node = next
  }
}

/**
 * The template tagging function, used like: html`<div></div>`(mountEl)
 * @param  {TemplateStringsArray} strings
 * @param  {any[]} ...expressions
 * @returns ArrowTemplate
 */
export function html(
  strings: TemplateStringsArray | string[],
  ...expSlots: ArrowExpression[]
): ArrowTemplate
export function html(
  strings: TemplateStringsArray | string[],
  ...expSlots: ArrowExpression[]
): ArrowTemplate {
  let chunk: Chunk | undefined
  let expressionPointer = storeExpressions(expSlots)

  function getExpressionPointer() {
    return expressionPointer < 0
      ? (template._e = expressionPointer = storeExpressions(expSlots))
      : expressionPointer
  }

  function getChunk() {
    if (!chunk) {
      chunk = createChunk(
        strings as string[]
      ) as unknown as Chunk
      chunk._t = template
      chunk.k = template._k
    }
    return chunk
  }
  let hasMounted = false

  // The actual template. Note templates can be moved and remounted by calling
  // the template function again. This takes all the rendered dom nodes and
  // moves them back into the document fragment to be re-appended.
  const template = ((el?: ParentNode) => {
    if (!hasMounted) {
      hasMounted = true
      return createBindings(getChunk(), getExpressionPointer(), el)
    } else {
      const chunk = getChunk()
      let node = chunk.ref.f
      if (node) {
        const last = chunk.ref.l
        if (node === last) chunk.dom.appendChild(node)
        else
          while (node) {
            const next: ChildNode | null =
              node === last ? null : (node.nextSibling as ChildNode | null)
            chunk.dom.appendChild(node)
            if (!next) break
            node = next
          }
      }
      return el ? el.appendChild(chunk.dom) : chunk.dom
    }
  }) as InternalTemplate

  // If the template contains no expressions, it is 100% static so it's key
  // its own content
  template.isT = true
  template._c = getChunk
  template._e = expressionPointer
  template.key = (key: ArrowTemplateKey): ArrowTemplate => {
    template._k = key
    return template
  }
  template.x = () => {
    if (expressionPointer + 1) {
      releaseExpressions(expressionPointer)
      template._e = -1
      expressionPointer = -1
    }
  }
  template.d = () => {
    hasMounted = false
    chunk = undefined
    template.x?.()
  }
  return template
}

/**
 * Applies bindings to a pathed chunk and returns the resulting document
 * fragment that is ready to mount.
 * @param chunk - A chunk of HTML with paths to the expressions.
 * @param expressions - An expression list with cursor.
 */
function createBindings(
  chunk: Chunk,
  expressionPointer: number,
  el?: ParentNode
): ParentNode | DocumentFragment {
  const totalPaths = expressionPool[expressionPointer] as number
  const stackStart = bindingStackPos + 1
  for (let i = 0; i < totalPaths; i++) {
    const path = chunk.paths[i]
    let node: Node = chunk.dom
    const segment = path[path.length - 1]
    const last = typeof segment === 'string' ? path.length - 1 : path.length
    for (let i = 0; i < last; i++)
      node = node.childNodes.item(path[i] as number)
    bindingStack[++bindingStackPos] = node
    bindingStack[++bindingStackPos] = segment
  }
  const stackEnd = bindingStackPos
  for (let s = stackStart, e = expressionPointer + 1; s < stackEnd; s++, e++) {
    const node = bindingStack[s]
    const segment = bindingStack[++s]
    if (typeof segment === 'string') {
      createAttrBinding(node as ChildNode, segment as string, e, chunk)
    } else {
      createNodeBinding(node as ChildNode, e, chunk)
    }
  }
  bindingStack.length = stackStart
  bindingStackPos = stackStart - 1
  return el ? el.appendChild(chunk.dom) && el : chunk.dom
}

/**
 * Adds a binding for a specific reactive piece of data by replacing the node.
 * @param node - A comment node to replace.
 * @param expression - An expression to bind to the node.
 * @param parentChunk - The parent chunk that contains the node.
 */
function createNodeBinding(
  node: ChildNode,
  expressionPointer: number,
  parentChunk: Chunk
) {
  let fragment: DocumentFragment | Text | Comment
  const expression = expressionPool[expressionPointer]
  if (isTpl(expression) || Array.isArray(expression)) {
    // We are dealing with a template that is not reactive. Render it.
    fragment = createRenderFn()(expression)!
  } else if (typeof expression === 'function') {
    const [frag, stop] = watch(expressionPointer, createRenderFn())
    ;(parentChunk.u ??= []).push(stop)
    fragment = frag!
  } else {
    fragment = isEmpty(expression)
      ? document.createComment('')
      : document.createTextNode(expression as string)
    onExpressionUpdate(
      expressionPointer,
      (value: string) => (fragment.nodeValue = value)
    )
  }
  if (node === parentChunk.ref.f || node === parentChunk.ref.l) {
    const last = fragment.nodeType === 11
      ? (fragment.lastChild as ChildNode | null)
      : (fragment as ChildNode)
    if (node === parentChunk.ref.f) {
      parentChunk.ref.f =
        fragment.nodeType === 11
          ? (fragment.firstChild as ChildNode | null)
          : (fragment as ChildNode)
    }
    if (node === parentChunk.ref.l) parentChunk.ref.l = last
  }
  node.parentNode?.replaceChild(fragment, node)
}

/**
 *
 * @param node -
 * @param expression
 */
function createAttrBinding(
  node: ChildNode,
  attrName: string,
  expressionPointer: number,
  parentChunk: Chunk
) {
  if (node.nodeType !== 1) return
  const el = node as Element
  const expression = expressionPool[expressionPointer]
  if (attrName[0] === '@') {
    el.addEventListener(
      attrName.slice(1),
      (evt) => (expressionPool[expressionPointer] as CallableFunction)?.(evt),
    )
    el.removeAttribute(attrName)
  } else if (typeof expression === 'function' && !isTpl(expression)) {
    // We are dealing with a reactive expression so perform watch binding.
    const [, stop] = watch(expressionPointer, (value) =>
      setAttr(el, attrName, value as string)
    )
    ;(parentChunk.u ??= []).push(stop)
  } else {
    setAttr(el, attrName, expression as string | number | boolean | null)
    onExpressionUpdate(expressionPointer, (value: string) =>
      setAttr(el, attrName, value)
    )
  }
}

/**
 *
 * @param parentChunk - The parent chunk that contains the node.
 */
function createRenderFn(): (
  renderable: ArrowRenderable
) => DocumentFragment | Text | Comment | void {
  let previous: Chunk | Text | Comment | Rendered[]
  const keyedChunks: Record<Exclude<ArrowTemplateKey, undefined>, Chunk> = {}
  let updaterFrag: DocumentFragment | null = null

  return function render(
    renderable: ArrowRenderable
  ): DocumentFragment | Text | Comment | void {
    if (!previous) {
      /**
       * Initial render:
       */
      if (isTpl(renderable)) {
        // do things
        const fragment = renderable()
        previous = renderable._c()
        return fragment
      } else if (Array.isArray(renderable)) {
        let fragment: DocumentFragment
        ;[fragment, previous] = renderList(renderable)
        return fragment
      } else if (isEmpty(renderable)) {
        return (previous = document.createComment(''))
      } else {
        return (previous = document.createTextNode(renderable as string))
      }
    } else {
      /**
       * Patching:
       */
      if (Array.isArray(renderable)) {
        if (!Array.isArray(previous)) {
          // Rendering a list where previously there was not a list.
          const [fragment, newList] = renderList(renderable)
          getNode(previous).after(fragment)
          forgetChunk(previous)
          unmount(previous)
          previous = newList
        } else {
          // Patching a list.
          let i = 0
          const renderableLength = renderable.length
          const previousLength = previous.length
          let anchor: ChildNode | undefined
          const renderedList: Rendered[] = []
          const previousToRemove = new Set(previous)
          if (renderableLength > previousLength) {
            updaterFrag ??= document.createDocumentFragment()
          }
          // We need to re-render a list, to do this we loop over every item in
          // our *updated* list and patch those items against what previously
          // was at that index - with 3 exceptions:
          //   1. This is a keyed item, in which case we need use the memoized
          //      keyed chunks to find the previous item.
          //   2. This is a new item, in which case we need to create a new one.
          //   3. This is an item that as a memo key, if that memo key matches
          //      the previous item, we perform no operation at all.
          for (; i < renderableLength; i++) {
            let item: string | number | boolean | ArrowTemplate = renderable[
              i
            ] as ArrowTemplate
            const prev: Rendered | undefined = previous[i]
            let key: ArrowTemplateKey
            if (
              isTpl(item) &&
              (key = item._k) !== undefined &&
              key in keyedChunks
            ) {
              const keyedChunk = keyedChunks[key]
              // This is a keyed item, so update the expressions and then
              // used the keyed chunk instead.
              updateExpressions(item._e, keyedChunk._t._e)
              if (keyedChunk._t !== item) (item as InternalTemplate).x?.()
              item = keyedChunk._t
            }
            if (i > previousLength - 1) {
              renderedList[i] = mountItem(item, updaterFrag!)
              continue
            }
            const used = patch(item, prev, anchor) as Rendered
            anchor = getNode(used)
            renderedList[i] = used
            previousToRemove.delete(used)
          }
          if (!renderableLength) {
            getNode(previous[0]).after(
              (renderedList[0] = document.createComment(''))
            )
          } else if (renderableLength > previousLength) {
            anchor?.after(updaterFrag!)
          }
          previousToRemove.forEach((stale) => {
            forgetChunk(stale)
            unmount(stale)
          })
          previous = renderedList
        }
      } else {
        previous = patch(renderable, previous)
      }
    }
  }

  /**
   * A utility function that renders an array of items for the first time.
   * @param renderable - A renderable that is an array of items.
   * @returns
   */
  function renderList(
    renderable: Array<string | number | boolean | ArrowTemplate>,
  ): [DocumentFragment, Rendered[]] {
    const fragment = document.createDocumentFragment()
    if (renderable.length === 0) {
      const placeholder = document.createComment('')
      fragment.appendChild(placeholder)
      return [fragment, [placeholder]]
    }
    const renderedItems: Rendered[] = []
    renderedItems.length = renderable.length
    for (let i = 0; i < renderable.length; i++) {
      renderedItems[i] = mountItem(renderable[i], fragment)
    }
    return [fragment, renderedItems]
  }

  /**
   * Updates, replaces, or initially renders a node or chunk.
   * @param renderable - The new renderable value.
   * @param prev - The previous node or chunk in this position.
   * @returns
   */
  function patch(
    renderable: Exclude<
      ArrowRenderable,
      Array<string | number | ArrowTemplate>
    >,
    prev: Chunk | Text | Comment | Rendered[],
    anchor?: ChildNode
  ): Chunk | Text | Comment | Rendered[] {
    // This is an update:
    const nodeType = (prev as Node).nodeType ?? 0
    if (!isEmpty(renderable) && nodeType === 3) {
      // The prev value was a text node and the new value is not empty
      // so we can just update the text node.
      if ((prev as Text).data != renderable)
        (prev as Text).data = renderable as string
      return prev
    } else if (isTpl(renderable)) {
      const chunk = renderable._c()
      if (chunk.k !== undefined && chunk.k in keyedChunks) {
        const keyedChunk = keyedChunks[chunk.k]
        if (keyedChunk === prev) return prev
        if (anchor) {
          moveDOMRef(keyedChunk.ref, anchor, true)
        } else {
          moveDOMRef(keyedChunk.ref, getNode(prev, undefined, true))
        }
        return keyedChunk
      } else if (isChunk(prev) && prev.paths === chunk.paths) {
        // This is a template that has already been rendered, so we only need to
        // update the expressions
        updateExpressions(chunk._t._e, prev._t._e)
        if (chunk._t !== prev._t) (chunk._t as InternalTemplate).x?.()
        return prev
      }

      // This is a new template, render it
      getNode(prev, anchor).after(renderable())
      forgetChunk(prev)
      unmount(prev)
      // If this chunk had a key, set it in our keyed chunks.
      if (chunk.k !== undefined) keyedChunks[chunk.k] = chunk
      return chunk
    } else if (isEmpty(renderable) && nodeType !== 8) {
      // This is an empty value and the prev value was not a comment
      // so we need to remove the prev value and replace it with a comment.
      const comment = document.createComment('')
      getNode(prev, anchor).after(comment)
      forgetChunk(prev)
      unmount(prev)
      return comment
    } else if (!isEmpty(renderable) && nodeType === 8) {
      // This is a non-empty value and the prev value was a comment
      // so we need to remove the prev value and replace it with a text node.
      const text = document.createTextNode(renderable as string)
      ;(prev as Comment).after(text)
      forgetChunk(prev)
      unmount(prev)
      return text
    }
    return prev!
  }

  function mountItem(
    item: string | number | boolean | ArrowTemplate,
    fragment: DocumentFragment
  ): Rendered {
    if (isTpl(item)) {
      fragment.appendChild(item())
      const chunk = item._c()
      if (chunk.k !== undefined) keyedChunks[chunk.k] = chunk
      return chunk
    }
    const node = isEmpty(item)
      ? document.createComment('')
      : document.createTextNode(item as string)
    fragment.appendChild(node)
    return node
  }

  function forgetChunk(item: Chunk | Text | Comment | Rendered[] | undefined) {
    if (isChunk(item) && item.k !== undefined && keyedChunks[item.k] === item) {
      delete keyedChunks[item.k]
    }
  }
}

let unmountStack: Array<
  | Chunk
  | Text
  | ChildNode
  | Array<Chunk | Text | ChildNode>
> = []

const queueUnmount = queue(() => {
  const removeItems = (
    chunk:
      | Chunk
      | Text
      | ChildNode
      | Array<Chunk | Text | ChildNode>
  ) => {
    if (isChunk(chunk)) {
      if (chunk.u) {
        for (let i = 0; i < chunk.u.length; i++) chunk.u[i]()
        chunk.u = null
      }
      let node = chunk.ref.f
      if (node) {
        const last = chunk.ref.l
        if (node === last) node.remove()
        else
          while (node) {
            const next: ChildNode | null =
              node === last ? null : (node.nextSibling as ChildNode | null)
            node.remove()
            if (!next) break
            node = next
          }
      }
      ;(chunk._t as InternalTemplate).d?.()
    } else if (Array.isArray(chunk)) {
      for (let i = 0; i < chunk.length; i++) removeItems(chunk[i])
    } else {
      chunk.remove()
    }
  }
  const stack = unmountStack
  unmountStack = []
  for (let i = 0; i < stack.length; i++) removeItems(stack[i])
})

/**
 * Unmounts a chunk from the DOM or a Text node from the DOM
 */
function unmount(
  chunk:
    | Chunk
    | Text
    | ChildNode
    | Array<Chunk | Text | ChildNode>
    | undefined
) {
  if (!chunk) return
  unmountStack.push(chunk)
  queueUnmount()
}

/**
 * Determines if a value is considered empty in the context of rendering a
 * Text node vs a comment placeholder.
 * @param value - Any value that can be considered empty.
 * @returns
 */
function isEmpty(value: unknown): value is null | undefined | '' | false {
  return !value && value !== 0
}

/**
 * Determines what the last node from the last render is so we can append items
 * after it.
 * @param chunk - The previous chunk or Text node that was rendered.
 * @returns
 */
function getNode(
  chunk: Chunk | Text | Comment | Array<Chunk | Text | Comment> | undefined,
  anchor?: ChildNode,
  first?: boolean
): ChildNode {
  if (!chunk && anchor) return anchor
  if (isChunk(chunk)) {
    return first ? chunk.ref.f || chunk.ref.l! : chunk.ref.l || chunk.ref.f || anchor!
  } else if (Array.isArray(chunk)) {
    return getNode(chunk[first ? 0 : chunk.length - 1], anchor, first)
  }
  return chunk!
}

/**
 * Creates a new Chunk object and memoizes it.
 * @param rawStrings - Initialize the chunk and memoize it.
 * @param memoKey - The key to memoize the chunk under.
 * @returns
 */
/**
 * Given a string of raw interlaced HTML (the arrow comments are already in the
 * approximately correct place), produce a Chunk object and memoize it.
 * @param html - A raw string of HTML
 * @returns
 */
export function createChunk(
  rawStrings: TemplateStringsArray | string[]
): Omit<Chunk, 'ref'> & { ref: DOMRef } {
  const memoKey = rawStrings.join(delimiterComment)
  const chunk: ChunkProto =
    chunkMemo[memoKey] ??
    (() => {
      const tpl = document.createElement('template')
      tpl.innerHTML = memoKey
      return (chunkMemo[memoKey] = {
        dom: tpl.content,
        paths: createPaths(tpl.content),
      })
    })()
  const dom = chunk.dom.cloneNode(true) as DocumentFragment
  const instance = Object.create(chunk) as Omit<Chunk, 'ref'> & { ref: DOMRef }
  instance.dom = dom
  instance.ref = {
    f: dom.firstChild as ChildNode | null,
    l: dom.lastChild as ChildNode | null,
  }
  return instance
}

/**
 * A list of attributes that can be located in the DOM that have expressions.
 * The list is populated by the expression index followed by the attribute name:
 * ```js
 * [1, 'data-foo', 1, '@click', 7, 'class']
 * ```
 */
const attrList: Array<string> = []

/**
 * Determines if the given node should be accepted or rejected by the tree
 * walker. If the node is an element and contains delimiters, it will also
 * populate the attrList array with the attribute names and expression counts.
 * This side effect avoids having to walk each node again.
 * @param el - The element to accept or reject.
 * @returns
 */
function filterNode(el: Node): 1 | 2 {
  if (el.nodeType === 8) return 1
  if (el.nodeType === 1) {
    const attrLen = (el as Element).attributes.length
    attrList.length = 0
    for (let i = 0; i < attrLen; i++) {
      const attr = (el as Element).attributes[i]
      if (attr.value === delimiterComment) attrList.push(attr.name)
    }
  }
  return attrList.length ? 1 : 2
}

/**
 * Given an expression index and a path, return an array of attribute paths.
 * @param exp - The expression index
 * @param path - The path to the expression
 * @returns
 */
/**
 * Given a document fragment with expressions comments, produce an array of
 * paths to the expressions and attribute expressions, and remove any attribute
 * expression comments as well.
 * @param dom - A DocumentFragment to locate expressions in.
 * @returns
 */
export function createPaths(dom: DocumentFragment): Chunk['paths'] {
  const paths: Chunk['paths'] = []
  const nodes = document.createNodeIterator(dom, 1 | 128, filterNode)
  let node: Node | null
  while ((node = nodes.nextNode())) {
    const path = getPath(node)
    if (node.nodeType === 1) {
      for (let i = 0; i < attrList.length; i++) {
        paths.push([...path, attrList[i]])
      }
    } else {
      paths.push(path)
    }
  }
  return paths
}

/**
 * Returns a path to a DOM node.
 * @param node - A DOM node (within a fragment) to return a path for
 * @returns
 */
export function getPath(node: Node): number[] {
  const path: number[] = []
  while (node.parentNode) {
    const children = node.parentNode.childNodes as NodeList
    const len = children.length
    for (let i = 0; i < len; i++) {
      const child = children[i]
      if (child === node) {
        path.unshift(i)
        break
      }
    }
    node = node.parentNode
  }
  return path
}
