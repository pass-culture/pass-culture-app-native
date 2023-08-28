import React from 'react'

export function usePrevious<T>(newValue: T) {
  const previousRef = React.useRef<T>()
  React.useEffect(() => {
    previousRef.current = newValue
  })
  return previousRef.current
}
