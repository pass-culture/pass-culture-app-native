import { object, string } from 'yup'

const FEEDBACK_IN_APP_VALUE_MAX_LENGTH = 800

export const setFeedbackInAppSchema = object().shape({
  feedback: string().min(1).max(FEEDBACK_IN_APP_VALUE_MAX_LENGTH),
})
