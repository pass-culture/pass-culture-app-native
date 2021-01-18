import { useState } from 'react'

export const useFilterSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  return {
    isEnabled,
    toggleSwitch,
  }
}
