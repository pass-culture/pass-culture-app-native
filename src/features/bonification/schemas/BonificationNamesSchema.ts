import { array, object, string } from 'yup'

import {
  containsNumber,
  containsOnlyLatinCharacters,
  containsSpecialCharacterAtTheBeginningOrEnd,
} from 'ui/components/inputs/nameCheck'

const baseNameSchema = string()
  .trim()
  .test(
    'no-numbers',
    'Ce champ ne doit pas contenir de chiffres.',
    (value) => !value || !containsNumber(value)
  )
  .test(
    'only-latin',
    'Ce champ contient des caractères invalides.',
    (value) => !value || containsOnlyLatinCharacters(value)
  )
  .test(
    'no-special-edges',
    "Ce champ ne doit pas commencer ou finir par un trait d'union ou une apostrophe.",
    (value) => !value || !containsSpecialCharacterAtTheBeginningOrEnd(value)
  )

export const BonificationNamesSchema = object().shape({
  firstNames: array()
    .of(
      baseNameSchema.test(
        'isRequiredIfFirst',
        'Le premier prénom est obligatoire.',
        (value, context) => {
          if (context?.parent?.indexOf(value) === 0) {
            return !!value && value.trim().length > 0
          }
          return true
        }
      )
    )
    .min(1, 'Le premier prénom est obligatoire'),

  givenName: baseNameSchema.required('Le nom de naissance est obligatoire'),

  commonName: baseNameSchema.optional(),
})
