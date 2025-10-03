import { object, string } from 'yup'

import { isNameValid } from 'ui/components/inputs/nameCheck'

export const BonificationNamesSchema = object().shape({
  firstName: string()
    .required('Le prénom est obligatoire')
    .test(
      'isFirstNameValid',
      'Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
  givenName: string()
    .required('Le nom de naissance est obligatoire')
    .test(
      'isGivenNameValid',
      'Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
  commonName: string().optional(),
})
