import { number, object, string } from 'yup'

import { InseeCountry } from 'api/gen'
import { isNameValid } from 'ui/components/inputs/nameCheck'

export const BonificationBirthPlaceSchema = object({
  birthCountrySelection: object()
    .shape({
      cog: number().required('Le pays de naissance est obligatoire.'),
      libcog: string()
        .required('Le pays de naissance est obligatoire.')
        .test(
          'isCountryValid',
          'Le pays ne doit pas contenir de chiffres ou de caractères spéciaux.',
          (name) => !!name && isNameValid(name)
        ),
    })
    .required('Le pays de naissance est obligatoire.')
    .nullable(),

  birthCity: object().when('birthCountrySelection', {
    is: (country: InseeCountry | null | undefined) => country?.libcog === 'France',
    then: (schema) =>
      schema
        .shape({
          name: string().required('Le nom de la ville est requis.'),
          code: string().required('Le code INSEE de la ville est requis.'),
          postalCode: string().required('Le code postal est requis.'),
          departementCode: string().required('Le numéro de département est requis.'),
        })
        .required('La ville de naissance est obligatoire pour les personnes nées en France.'),
    otherwise: (schema) => schema.optional(),
  }),
})
