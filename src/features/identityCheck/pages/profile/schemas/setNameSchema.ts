import { object, string } from 'yup'

import { isNameValid } from 'ui/components/inputs/nameCheck'

export const setNameSchema = object().shape({
  firstName: string()
    .required('Le prénom est obligatoire')
    .test(
      'isFirstNameValid',
      'Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
  lastName: string()
    .required('Le nom est obligatoire')
    .test(
      'isLastNameValid',
      'Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.',
      (name) => !!name && isNameValid(name)
    ),
})
