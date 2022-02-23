import { t } from '@lingui/macro'
import { useTheme } from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import {
  DEFAULT_YOUNGEST_AGE,
  UNDER_YOUNGEST_AGE,
} from 'features/auth/signup/SetBirthday/utils/constants'
import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'

export const useDatePickerErrorHandler = (date?: Date) => {
  const { isTouch } = useTheme()
  const CURRENT_DATE = new Date()
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const DEFAULT_SELECTED_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(DEFAULT_SELECTED_DATE)

  const { data: settings } = useAppSettings()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE

  if (date === undefined) {
    return {
      isDisabled: true,
      errorMessage: null,
    }
  }
  const SELECTED_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(date)
  const AGE = dateDiffInFullYears(new Date(SELECTED_DATE_WITHOUT_TIME), CURRENT_DATE)
  if (SELECTED_DATE_WITHOUT_TIME === DEFAULT_SELECTED_DATE_WITHOUT_TIME && isTouch) {
    return {
      isDisabled: true,
      errorMessage: null,
    }
  }
  if (AGE < 0) {
    return {
      isDisabled: true,
      errorMessage: t`Tu ne peux pas choisir une date dans le futur`,
    }
  }
  if (AGE < 15) {
    analytics.logSignUpTooYoung(AGE)
    return {
      isDisabled: true,
      errorMessage: t`Tu dois avoir au moins ${youngestAge}\u00a0ans pour t’inscrire au pass Culture`,
    }
  }
  return {
    isDisabled: false,
    errorMessage: null,
  }
}
