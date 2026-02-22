interface StringOrNumber { value: string | number, }

interface Item<T = undefined> {
  title: string
  subtitle: string
  data: T
  onClick: () => void
}

interface Recipe {
  items?: Item[]
  date?: string
}

interface Settings {
  currency_sign?: string
  language: 'en' | 'pl' | 'ua'
}

interface ListItem<T> {
  title: string
  subtitle?: string
  data?: T
  onClick?: (option: ListItem<T>) => void
  onRemove?: (option: ListItem<T>) => void
}
