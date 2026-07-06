import { useEffect, useState } from 'react'

import { useAppStateChange } from 'libs/appState'

let appInBackgroundTime: null | number = null

export const useTimer = (initialValueInSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialValueInSeconds)

  useEffect(() => {
    let timerId: NodeJS.Timeout
    if (timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    }

    return () => clearInterval(timerId)
  })

  useAppStateChange(
    () => {
      if (appInBackgroundTime) {
        const elapsedTimeInSeconds = Math.floor((Date.now() - appInBackgroundTime) / 1000)
        setTimeLeft((timeLeft) => Math.max(timeLeft - elapsedTimeInSeconds, 0))
      }
    },
    () => {
      appInBackgroundTime = Date.now()
    }
  )

  return { timeLeft, setTimeLeft }
}
