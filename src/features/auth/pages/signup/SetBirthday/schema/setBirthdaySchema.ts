import { date, object } from 'yup'

import { analytics } from 'libs/analytics/provider'
import { dateDiffInFullYears } from 'libs/dates'

export const setBirthdaySchema = object().shape({
  birthdate: date()
    .required('La date de naissance est obligatoire')
    .test(
      'is-old-enough',
      'Tu dois avoir au moins 15\u00a0ans pour t’inscrire au pass Culture',
      (date) => {
        if (!date) return false
        const age = dateDiffInFullYears(date, new Date())
        if (age < 15) {
          analytics.logSignUpTooYoung(age)
          return false
        }
        return true
      }
    ),
})
