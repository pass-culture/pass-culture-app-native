import React, { memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { EligibilityMessage } from 'features/profile/components/Header/NonBeneficiaryHeader/EligibilityMessage'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useLocation, GeolocPermissionState } from 'libs/geolocation'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Spacer } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
}

function NonBeneficiaryHeaderComponent({
  eligibilityEndDatetime,
  eligibilityStartDatetime,
}: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const today = new Date()
  const { data: subscription } = useNextSubscriptionStep()

  const { permissionState } = useLocation()
  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useHomeBanner(isGeolocated)
  const homeBanner = data?.banner

  const formattedEligibilityStartDatetime = eligibilityStartDatetime
    ? new Date(eligibilityStartDatetime)
    : undefined

  const formattedEligibilityEndDatetime = eligibilityEndDatetime
    ? formatToSlashedFrenchDate(new Date(eligibilityEndDatetime).toISOString())
    : undefined

  const isUserTooYoungToBeEligible =
    formattedEligibilityStartDatetime && formattedEligibilityStartDatetime > today

  const NonBeneficiaryBanner = () => {
    if (isUserTooYoungToBeEligible) {
      return (
        <BannerContainer>
          <Spacer.Column numberOfSpaces={2} />
          <YoungerBadge eligibilityStartDatetime={formattedEligibilityStartDatetime} />
        </BannerContainer>
      )
    }

    if (subscription?.subscriptionMessage) {
      return (
        <BannerContainer>
          <SubscriptionMessageBadge subscriptionMessage={subscription.subscriptionMessage} />
        </BannerContainer>
      )
    }

    if (homeBanner?.name === BannerName.activation_banner) {
      return (
        <BannerContainer testID="eligibility-banner-container">
          <EligibilityMessage formattedEligibilityEndDatetime={formattedEligibilityEndDatetime} />
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BicolorUnlock}
            from={StepperOrigin.PROFILE}
          />
        </BannerContainer>
      )
    }

    if (homeBanner?.name === BannerName.transition_17_18_banner) {
      return (
        <BannerContainer testID="eligibility-banner-container">
          <EligibilityMessage formattedEligibilityEndDatetime={formattedEligibilityEndDatetime} />
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BirthdayCake}
            from={StepperOrigin.PROFILE}
          />
        </BannerContainer>
      )
    }
    if (subscription?.hasIdentityCheckPending) {
      return (
        <BannerContainer>
          <Spacer.Column numberOfSpaces={2} />
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
