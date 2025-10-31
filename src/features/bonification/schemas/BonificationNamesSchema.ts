import { array, object, string } from 'yup'

import { isNameValid } from 'ui/components/inputs/nameCheck'

export const BonificationNamesSchema = object().shape({
  firstNameList: array()
    .of(
      string().test(
        'isNameValidOptional',
        'Les prénoms ne doivent pas contenir de chiffres ou de caractères spéciaux.',
        (value, context) => {
          if (context?.parent?.indexOf(value) === 0) return !!value && isNameValid(value)
          else return !value || isNameValid(value)
        }
      )
    )
    .min(1, 'Le premier prénom est obligatoire'),
  givenName: string()
    .required('Le nom de naissance est obligatoire')
    .test(
      'isGivenNameValid',
      'Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
  commonName: string().optional(),
})
