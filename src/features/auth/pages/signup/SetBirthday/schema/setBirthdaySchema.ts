import { format } from 'date-fns'
import { date, object } from 'yup'

import { MINIMUM_DATE } from 'features/auth/constants'
import { dateDiffInFullYears } from 'libs/dates'

export const setBirthdaySchema = object().shape({
  birthdate: date()
    .required('La date de naissance est obligatoire')
    .min(MINIMUM_DATE, `La date doit être postérieure au ${format(MINIMUM_DATE, 'dd/MM/yyyy')}`)
    .test(
      'is-old-enough',
      'Tu dois avoir au moins 15\u00a0ans pour t’inscrire au pass Culture',
      (birthdate) => {
        if (!birthdate) return false
        return dateDiffInFullYears(birthdate, new Date()) >= 15
      }
    ),
})
