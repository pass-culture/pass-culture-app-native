import { object, string } from 'yup'

import { isNameValid } from 'ui/components/inputs/nameCheck'

export const BonificationBirthPlaceSchema = object().shape({
  birthCountry: string()
    .required('Le pays de naissance est obligatoire')
    .test(
      'isCountryValid',
      'Le pays ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
  birthCity: string()
    .required('La ville de naissance est obligatoire pour les personnes nées en France')
    .test(
      'isCityValid',
      'La ville ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
})
