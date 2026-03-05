import { createVNode, render } from 'vue'
import type { Component, VNodeProps } from 'vue'

export function showModal<TProps>(ModalComponent: Component<TProps>, props?: TProps) {
  
  const container = document.createElement('div')
  document.body.appendChild(container)

  const vnode = createVNode(ModalComponent, props as VNodeProps)
  render(vnode, container)


  const observer = new MutationObserver(() => {
    const hasActualContent = Array.from(container.childNodes).some(
      (node) => node.nodeType !== Node.COMMENT_NODE,
    )

    if (!hasActualContent) {
      clean()
    }
  })

  observer.observe(container, { childList: true })

  function clean() {
    observer.disconnect() 
    render(null, container) 
    container.remove() 
  }
  
  return clean
}
