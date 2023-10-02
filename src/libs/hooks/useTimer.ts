import { useEffect, useState } from 'react'

export const useTimer = (initialValue: number) => {
  const [timeLeft, setTimeLeft] = useState(initialValue)

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
