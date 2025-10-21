import { object, string } from 'yup'

import { isNameValid } from 'ui/components/inputs/nameCheck'

export const BonificationBirthPlaceSchema = object().shape({
  birthCountrySelection: string()
    .required('Le pays de naissance est obligatoire')
    .test(
      'isCountryValid',
      'Le pays ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
  birthCity: string().when('birthCountrySelection', {
    is: (country) => country === 'France',
    then: (schema) =>
      schema.required('La ville de naissance est obligatoire pour les personnes nées en France'),
    otherwise: (schema) => schema.optional(),
  }),
})
