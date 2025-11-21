import React from 'react'

import { validateTechnicalProblemBanner } from 'features/technicalProblemBanner/utils/technicalProblemBannerSchema'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'

type TechnicalProblemBannerProps = {
  options: Record<string, unknown>
}

const mapSeverityToBannerType = (severity: string): BannerType => {
  switch (severity) {
    case 'success':
      return BannerType.SUCCESS
    case 'alert':
      return BannerType.ALERT
    case 'error':
      return BannerType.ERROR
    default:
      return BannerType.DEFAULT
  }
}

export const TechnicalProblemBanner = ({ options }: TechnicalProblemBannerProps) => {
  const validatedOptions = validateTechnicalProblemBanner(options)

  if (!validatedOptions) return null

  const { severity, label, message } = validatedOptions
  const bannerType = mapSeverityToBannerType(severity)

  return (
    <Banner label={label} description={message} type={bannerType} testID="technicalProblemBanner" />
  )
}
