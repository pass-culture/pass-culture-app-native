import { useEffect, useRef, useState } from 'react'

import { clearLocalInterval } from 'libs/timer'

export const useCountdownDays = (dateCreated: string) => {
  const countDownDate = new Date(dateCreated).getTime()

  const MILLISECONDS = 1000
  const SECONDS = 60
  const MINUTES = 60
  const HOURS = 24
  const DAYS = 30

  const daysUntilExpiration =
    Math.floor(
      (countDownDate - new Date().getTime()) / (MILLISECONDS * SECONDS * MINUTES * HOURS)
    ) + DAYS

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
