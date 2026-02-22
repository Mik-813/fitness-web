export function debounce(fn: () => void, milliseconds = 1000) {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, milliseconds)
  }
}

export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  milliseconds = 1000,
) {
  let inThrottle = false
  return (...args: Args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, milliseconds)
    }
  }
}
