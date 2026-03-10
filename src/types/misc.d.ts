interface Identifiable {
  id?: number
  key?: number
  [prop: string]: any
}

interface Item<T=undefined> {
  title: string
  subtitle?: string
  data?: T
  onClick?: (option?: Item<T>) => void
  onRemove?: (option?: Item<T>) => void
}

interface Stat {
  title: string
  formula: (product: Product) => number
}
