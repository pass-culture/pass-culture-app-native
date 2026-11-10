import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Activity } from 'api/gen'
import { getSurveyConfigFromActivity } from 'features/venue/helpers/getSurveyConfigFromActivity'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Bulb } from 'ui/svg/icons/Bulb'

interface VenueSurveyBannerProps {
  activity: Activity | null
  onBeforeNavigate: () => void
}

export const VenueSurveyBanner: FC<VenueSurveyBannerProps> = ({ activity, onBeforeNavigate }) => {
  const surveyConfig = getSurveyConfigFromActivity(activity)

  if (!surveyConfig) {
    return null
  }

  return (
    <BannerContainer>
      <Banner
        label="Un avis sur cette page&nbsp;?"
        description={`Partage-nous tes idées pour améliorer ton expérience ${surveyConfig.descriptionEnd}`}
        links={[
          {
            wording: 'Donner mon avis (2 min)',
            externalNav: { url: surveyConfig.url },
            onBeforeNavigate: onBeforeNavigate,
          },
        ]}
        Icon={Bulb}
      />
    </BannerContainer>
  )
}

const BannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
