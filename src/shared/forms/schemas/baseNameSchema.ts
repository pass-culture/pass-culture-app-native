import { string } from 'yup'

import {
  containsNumber,
  containsOnlyLatinCharacters,
  containsSpecialCharacterAtTheBeginningOrEnd,
} from 'ui/components/inputs/nameCheck'

export const baseNameSchema = string()
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
