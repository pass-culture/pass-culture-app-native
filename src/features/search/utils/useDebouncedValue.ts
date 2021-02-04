import debounce from 'lodash.debounce'
import { useEffect, useRef, useState } from 'react'

export const useDebouncedValue = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const debouncedSetValue = useRef(debounce(setDebouncedValue, delay)).current

  useEffect(() => {
    debouncedSetValue(value)
  }, [value])

  return debouncedValue
}
