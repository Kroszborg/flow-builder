import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number, immediate = false): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    if (immediate) {
      setDebouncedValue(value)
      return
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, immediate])

  return debouncedValue
}

