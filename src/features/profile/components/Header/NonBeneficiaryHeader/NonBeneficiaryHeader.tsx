import React, { memo, PropsWithChildren, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { Subtitle } from 'features/profile/atoms/Subtitle'
import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { useIsUserUnderage } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { Spacer, Typo } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
}

function NonBeneficiaryHeaderComponent({
  eligibilityEndDatetime,
  eligibilityStartDatetime,
}: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const [error, setError] = useState<Error | undefined>()
  const today = new Date()
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit
  const { data: subscription } = useNextSubscriptionStep()

  const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)
  const isUserUnderage = useIsUserUnderage()

  const deposit = depositAmount.replace(' ', '')

  const formattedEligibilityStartDatetime = eligibilityStartDatetime
    ? new Date(eligibilityStartDatetime)
    : undefined

  const formattedEligibilityEndDatetime = eligibilityEndDatetime
    ? formatToSlashedFrenchDate(new Date(eligibilityEndDatetime).toISOString())
    : undefined

  const moduleBannerWording = isUserUnderage ? 'Profite de ton crédit' : `Profite de ${deposit}`

  if (error) {
    throw error
  }

  const isUserTooYoungToBeEligible =
    formattedEligibilityStartDatetime && formattedEligibilityStartDatetime > today

  const NonBeneficiaryBanner = () => {
    if (isUserTooYoungToBeEligible) {
      return (
        <BannerContainer>
          <YoungerBadge eligibilityStartDatetime={formattedEligibilityStartDatetime} />
        </BannerContainer>
      )
    }

    if (subscription?.subscriptionMessage) {
      return (
        <BannerContainer>
          <SubscriptionMessageBadge subscriptionMessage={subscription?.subscriptionMessage} />
        </BannerContainer>
      )
    }
    if (subscription?.nextSubscriptionStep) {
      return (
        <BannerContainer>
          <View testID="eligibility-banner-container">
            {!!formattedEligibilityEndDatetime && (
              <React.Fragment>
                <Subtitle
                  startSubtitle="Tu es éligible jusqu’au"
                  boldEndSubtitle={formattedEligibilityEndDatetime}
                />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            )}
            {!!nextBeneficiaryValidationStepNavConfig && (
              <BannerWithBackground
                navigateTo={nextBeneficiaryValidationStepNavConfig}
                leftIcon={ThumbUp}
                testID="eligibility-banner">
                <ButtonText>{moduleBannerWording}</ButtonText>
                <Spacer.Column numberOfSpaces={1} />
                <BodyText>à dépenser dans l’application</BodyText>
              </BannerWithBackground>
            )}
          </View>
        </BannerContainer>
      )
    }
    if (subscription?.hasIdentityCheckPending) {
      return (
        <BannerContainer>
          <IdentityCheckPendingBadge />
        </BannerContainer>
      )
    }

    return null
  }

  return (
    <React.Fragment>
      <PageHeader title="Mon profil" />
      <NonBeneficiaryBanner />
    </React.Fragment>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

const BannerContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  position: 'relative',
}))

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const BodyText = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
