import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'

import { useAppSettings } from 'features/auth/settings'
import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'

const DEFAULT_YOUNGEST_AGE = 15
const UNDER_YOUNGEST_AGE = DEFAULT_YOUNGEST_AGE - 1

export const useDatePickerErrorHandler = (date?: Date) => {
  const CURRENT_DATE = new Date()
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const DEFAULT_SELECTED_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(DEFAULT_SELECTED_DATE)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(true)

  const { data: settings } = useAppSettings()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE

  useEffect(() => {
    if (date === undefined) {
      return setIsDisabled(true), setErrorMessage(null)
    }

    const SELECTED_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(date)
    const AGE = dateDiffInFullYears(new Date(SELECTED_DATE_WITHOUT_TIME), CURRENT_DATE)

    if (SELECTED_DATE_WITHOUT_TIME === DEFAULT_SELECTED_DATE_WITHOUT_TIME) {
      return setIsDisabled(true), setErrorMessage(null)
    }
    if (AGE < 0) {
      return (
        setIsDisabled(true),
        setErrorMessage(t`Tu ne peux pas choisir une date dans le futur`),
        setIsDisabled(true)
      )
    }
    if (AGE < 15) {
      return (
        analytics.logSignUpTooYoung(AGE),
        setIsDisabled(true),
        setErrorMessage(
          t`Tu dois avoir au moins\u00a0${youngestAge}\u00a0ans pour t’inscrire au pass Culture`
        )
      )
    }
    setIsDisabled(false)
    setErrorMessage(null)
  }, [date])

  return { isDisabled, errorMessage }
}
