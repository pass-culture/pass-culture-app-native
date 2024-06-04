import { useNavigation } from '@react-navigation/native'
import React, { ComponentType, FunctionComponent, memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { Banner, BannerName } from 'api/gen'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { EligibilityMessage } from 'features/profile/components/Header/NonBeneficiaryHeader/EligibilityMessage'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
}

function NonBeneficiaryHeaderComponent({
  eligibilityEndDatetime,
  eligibilityStartDatetime,
}: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  return (
    <React.Fragment>
      <PageHeader title="Mon profil" />
      <NonBeneficiaryBanner
        eligibilityEndDatetime={eligibilityEndDatetime}
        eligibilityStartDatetime={eligibilityStartDatetime}
      />
    </React.Fragment>
  )
}

type BannerProps = {
  homeBanner: Banner
  Icon: FunctionComponent<AccessibleIcon>
  formattedEligibilityEndDatetime?: string
}

function BannerWithBackground({ homeBanner, Icon, formattedEligibilityEndDatetime }: BannerProps) {
  return (
    <BannerContainer testID="eligibility-banner-container">
      <EligibilityMessage formattedEligibilityEndDatetime={formattedEligibilityEndDatetime} />
      <ActivationBanner
        title={homeBanner.title}
        subtitle={homeBanner.text}
        icon={Icon}
        from={StepperOrigin.PROFILE}
      />
    </BannerContainer>
  )
}

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const systemBannerIcons: {
  [key in Exclude<BannerName, 'geolocation_banner' | 'retry_identity_check_banner'>]: ComponentType
} = {
  [BannerName.activation_banner]: StyledBicolorUnlock,
  [BannerName.transition_17_18_banner]: StyledBirthdayCake,
}

const bannerIcons: {
  [key in Exclude<
    BannerName,
    'geolocation_banner' | 'retry_identity_check_banner'
  >]: FunctionComponent<AccessibleIcon>
} = {
  [BannerName.activation_banner]: BicolorUnlock,
  [BannerName.transition_17_18_banner]: BirthdayCake,
}

function SystemBanner({ homeBanner, Icon, formattedEligibilityEndDatetime }: BannerProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  const onPress = () => {
    navigate('Stepper', { from: StepperOrigin.PROFILE })
  }

  return (
    <BannerContainer testID="eligibility-system-banner-container">
      <EligibilityMessage formattedEligibilityEndDatetime={formattedEligibilityEndDatetime} />
      <GenericSystemBanner
        LeftIcon={<Icon />}
        title={homeBanner.title}
        subtitle={homeBanner.text}
        accessibilityLabel={homeBanner.text}
        onPress={onPress}
      />
    </BannerContainer>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

function NonBeneficiaryBanner({
  eligibilityStartDatetime,
  eligibilityEndDatetime,
}: Readonly<NonBeneficiaryHeaderProps>) {
  const today = new Date()
  const { data: subscription } = useGetStepperInfo()
  const enableSystemBanner = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK)

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

  if (
    homeBanner?.name === BannerName.activation_banner ||
    homeBanner?.name === BannerName.transition_17_18_banner
  ) {
    const BannerComponent = enableSystemBanner ? SystemBanner : BannerWithBackground
    const Icon = enableSystemBanner
      ? (systemBannerIcons[homeBanner?.name] as FunctionComponent<AccessibleIcon>)
      : bannerIcons[homeBanner?.name]

    return (
      <BannerComponent
        Icon={Icon}
        homeBanner={homeBanner}
        formattedEligibilityEndDatetime={formattedEligibilityEndDatetime}
      />
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

const BannerContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  position: 'relative',
}))
