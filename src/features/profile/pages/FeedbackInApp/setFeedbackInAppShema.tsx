import { object, string } from 'yup'

import { FEEDBACK_IN_APP_VALUE_MAX_LENGTH } from 'features/profile/pages/FeedbackInApp/FeedbackInApp'

export const setFeedbackInAppSchema = object().shape({
  feedback: string().min(1).max(FEEDBACK_IN_APP_VALUE_MAX_LENGTH),
})
