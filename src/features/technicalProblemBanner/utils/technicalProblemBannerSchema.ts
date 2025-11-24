import { InferType, object, string } from 'yup'

import { eventMonitoring } from 'libs/monitoring/services'

const technicalProblemBannerSchema = object({
  severity: string().oneOf(['default', 'success', 'alert', 'error']).required(),
  label: string().required(),
  message: string().required(),
})

export type TechnicalProblemBannerType = InferType<typeof technicalProblemBannerSchema>

export const validateTechnicalProblemBanner = (
  objectToValidate: unknown
): TechnicalProblemBannerType | null => {
  try {
    return technicalProblemBannerSchema.validateSync(objectToValidate)
  } catch (error) {
    eventMonitoring.captureException(
      new Error(`TechnicalProblemBanner validation issue: ${String(error)}`),
      {
        extra: { objectToValidate },
      }
    )
    return null
  }
}
