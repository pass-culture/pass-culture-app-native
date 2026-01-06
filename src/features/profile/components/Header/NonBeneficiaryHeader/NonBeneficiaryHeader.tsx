import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { Banner, BannerName } from 'api/gen'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { EligibilityMessage } from 'features/profile/components/Header/NonBeneficiaryHeader/EligibilityMessage'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Unlock } from 'ui/svg/icons/Unlock'
import { Typo } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  featureFlags: { disableActivation: boolean }
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
  eligibilityEndDateInSystemBanner?: boolean
}

function NonBeneficiaryHeaderComponent({
  featureFlags,
  eligibilityEndDatetime,
  eligibilityStartDatetime,
  eligibilityEndDateInSystemBanner,
}: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  return (
    <React.Fragment>
      <PageHeader title="Mon profil" />
      <NonBeneficiaryBanner
        featureFlags={featureFlags}
        eligibilityEndDatetime={eligibilityEndDatetime}
        eligibilityStartDatetime={eligibilityStartDatetime}
        eligibilityEndDateInSystemBanner={eligibilityEndDateInSystemBanner}
      />
    </React.Fragment>
  )
}

type SystemBannerProps = {
  homeBanner: Banner
  Icon: FunctionComponent<AccessibleIcon>
  formattedEligibilityEndDatetime?: string
  eligibilityEndDateInSystemBanner?: boolean
}

const StyledUnlock = styled(Unlock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandSecondary,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandSecondary,
}))``

const systemBannerIcons: {
  [key in Exclude<
    BannerName,
    'geolocation_banner' | 'retry_identity_check_banner'
  >]: React.FunctionComponent<AccessibleIcon>
} = {
  [BannerName.activation_banner]: StyledUnlock,
  [BannerName.transition_17_18_banner]: StyledBirthdayCake,
}

function SystemBanner({
  homeBanner,
  Icon,
  formattedEligibilityEndDatetime,
  eligibilityEndDateInSystemBanner = false,
}: SystemBannerProps) {
  const { navigate } = useNavigation<UseNavigationType>()

  const onPress = () => {
    navigate(...getSubscriptionHookConfig('Stepper', { from: StepperOrigin.PROFILE }))
  }

  const defaultSubtitle = 'Tu es éligible jusqu’à la veille de tes 19 ans'

  const subtitle = formattedEligibilityEndDatetime ? (
    <Typo.Body>
      Tu es éligible jusqu’au <Typo.BodyAccent>{formattedEligibilityEndDatetime}</Typo.BodyAccent>
    </Typo.Body>
  ) : (
    defaultSubtitle
  )

  const subtitleAccessibilityLabel = formattedEligibilityEndDatetime
    ? `Tu es éligible jusqu’au ${formattedEligibilityEndDatetime}`
    : defaultSubtitle

  if (eligibilityEndDateInSystemBanner) {
    return (
      <BannerContainer testID="eligibility-system-banner-container">
        <GenericSystemBanner
          leftIcon={Icon}
          title={homeBanner.title}
          subtitle={subtitle}
          accessibilityLabel={`${homeBanner.title} ${subtitleAccessibilityLabel}`}
          onPress={onPress}
          analyticsParams={{ type: 'credit', from: 'profile' }}
        />
      </BannerContainer>
    )
  }

  return (
    <BannerContainer testID="eligibility-system-banner-container">
      <EligibilityMessage formattedEligibilityEndDatetime={formattedEligibilityEndDatetime} />
      <GenericSystemBanner
        leftIcon={Icon}
        title={homeBanner.title}
        subtitle={homeBanner.text}
        onPress={onPress}
        analyticsParams={{ type: 'credit', from: 'profile' }}
      />
    </BannerContainer>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

export function NonBeneficiaryBanner({
  featureFlags,
  eligibilityStartDatetime,
  eligibilityEndDatetime,
  eligibilityEndDateInSystemBanner,
}: Readonly<NonBeneficiaryHeaderProps>) {
  const today = new Date()
  const { data: subscription } = useGetStepperInfoQuery()
  const { banner } = useActivationBanner()
  const { options: remoteActivationBannerOptions } = useFeatureFlagOptionsQuery(
    RemoteStoreFeatureFlags.DISABLE_ACTIVATION
  )

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
      <BannerContainer withMarginTop>
        <YoungerBadge eligibilityStartDatetime={formattedEligibilityStartDatetime} />
      </BannerContainer>
    )
  }

  if (subscription?.subscriptionMessage && remoteActivationBannerOptions) {
    return (
      <BannerContainer>
        <SubscriptionMessageBadge
          disableActivation={featureFlags.disableActivation}
          subscriptionMessage={subscription.subscriptionMessage}
          remoteActivationBannerOptions={remoteActivationBannerOptions}
        />
      </BannerContainer>
    )
  }

  if (
    banner.name === BannerName.activation_banner ||
    banner.name === BannerName.transition_17_18_banner
  ) {
    if (featureFlags.disableActivation && remoteActivationBannerOptions) {
      return (
        <BannerContainer withMarginTop>
          <RemoteActivationBanner
            from="profile"
            remoteActivationBannerOptions={remoteActivationBannerOptions}
          />
        </BannerContainer>
      )
    }

    return (
      <SystemBanner
        Icon={systemBannerIcons[banner.name]}
        homeBanner={banner as Banner} // Use this as because API typing return Banner | null but it's never null
        formattedEligibilityEndDatetime={formattedEligibilityEndDatetime}
        eligibilityEndDateInSystemBanner={eligibilityEndDateInSystemBanner}
      />
    )
  }

  if (subscription?.hasIdentityCheckPending) {
    return (
      <BannerContainer withMarginTop>
        <IdentityCheckPendingBadge />
      </BannerContainer>
    )
  }

  return null
}

const BannerContainer = styled.View<{ withMarginTop?: boolean }>(
  ({ theme, withMarginTop = false }) => ({
    marginTop: withMarginTop ? theme.designSystem.size.spacing.s : undefined,
    paddingHorizontal: theme.contentPage.marginHorizontal,
    position: 'relative',
  })
)
