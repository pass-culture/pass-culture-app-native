import { useEffect, useState } from 'react'

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

  return { timeLeft, setTimeLeft }
}
