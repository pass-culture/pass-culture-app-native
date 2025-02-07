import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { Banner, BannerName } from 'api/gen'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { EligibilityMessage } from 'features/profile/components/Header/NonBeneficiaryHeader/EligibilityMessage'
import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  featureFlags: { enableSystemBanner: boolean; disableActivation: boolean }
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
}

function NonBeneficiaryHeaderComponent({
  featureFlags,
  eligibilityEndDatetime,
  eligibilityStartDatetime,
}: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  return (
    <React.Fragment>
      <PageHeader title="Mon profil" />
      <NonBeneficiaryBanner
        featureFlags={featureFlags}
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
  [key in Exclude<
    BannerName,
    'geolocation_banner' | 'retry_identity_check_banner'
  >]: React.FunctionComponent<AccessibleIcon>
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
        analyticsParams={{ type: 'credit', from: 'profile' }}
      />
    </BannerContainer>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

function NonBeneficiaryBanner({
  featureFlags,
  eligibilityStartDatetime,
  eligibilityEndDatetime,
}: Readonly<NonBeneficiaryHeaderProps>) {
  const today = new Date()
  const { data: subscription } = useGetStepperInfo()
  const { banner } = useActivationBanner()

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
        <SubscriptionMessageBadge
          disableActivation={featureFlags.disableActivation}
          subscriptionMessage={subscription.subscriptionMessage}
        />
      </BannerContainer>
    )
  }

  if (
    banner.name === BannerName.activation_banner ||
    banner.name === BannerName.transition_17_18_banner
  ) {
    if (featureFlags.disableActivation) {
      return (
        <BannerContainer>
          <Spacer.Column numberOfSpaces={2} />
          <RemoteBanner />
        </BannerContainer>
      )
    }

    const ActivationBannerComponent = featureFlags.enableSystemBanner
      ? SystemBanner
      : BannerWithBackground
    const ActivationBannerIcon = featureFlags.enableSystemBanner
      ? systemBannerIcons[banner.name]
      : bannerIcons[banner.name]

    return (
      <ActivationBannerComponent
        Icon={ActivationBannerIcon}
        homeBanner={banner as Banner} // Use this as because API typing return Banner | null but it's never null
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
