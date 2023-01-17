import { useEffect, useState } from 'react'

export const useCountdownDays = (dateCreated: string) => {
  const countDownDate = new Date(dateCreated).getTime()

  const [daysLeft, setDaysLeft] = useState(
    Math.floor((countDownDate - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 30
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft(Math.floor((countDownDate - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 30)
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  return daysLeft
}
