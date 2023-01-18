import { useEffect, useRef, useState } from 'react'

import { clearLocalInterval } from 'libs/timer'

export const useCountdownDays = (dateCreated: string) => {
  const countDownDate = new Date(dateCreated).getTime()

  const milliseconds = 1000
  const seconds = 60
  const minutes = 60
  const hours = 24
  const days = 30

  const daysUntilExpiration =
    Math.floor(
      (countDownDate - new Date().getTime()) / (milliseconds * seconds * minutes * hours)
    ) + days

  const [daysLeft, setDaysLeft] = useState(daysUntilExpiration)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = global.setInterval(() => {
      setDaysLeft(daysUntilExpiration)
    }, 1000)

    return () => clearLocalInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDownDate])

  return daysLeft
}
