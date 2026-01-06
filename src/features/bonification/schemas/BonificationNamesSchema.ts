import { array, object } from 'yup'

import { baseNameSchema } from 'shared/forms/schemas/baseNameSchema'

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
