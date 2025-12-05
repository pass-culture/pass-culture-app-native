import { object, string } from 'yup'

const FEEDBACK_IN_APP_VALUE_MAX_LENGTH = 800

export const setFeedbackInAppSchema = object().shape({
  feedback: string()
    .min(1, 'Remplis le champ ci-dessus pour continuer')
    .max(FEEDBACK_IN_APP_VALUE_MAX_LENGTH, 'Maximun 800 caractères'),
})
