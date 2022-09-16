import React, { memo, PropsWithChildren, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SubscriptionMessage } from 'api/gen'
import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { useIsUserUnderage } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Typo } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
  lastUpdated?: string
  subscriptionMessage?: SubscriptionMessage | null
  isEligibleForBeneficiaryUpgrade?: boolean
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const [error, setError] = useState<Error | undefined>()
  const today = new Date()
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit
  const { data: subscription } = useNextSubscriptionStep()

  const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)
  const isUserUnderage = useIsUserUnderage()

  const deposit = depositAmount.replace(/\s/, '')

  const eligibilityStartDatetime = props.eligibilityStartDatetime
    ? new Date(props.eligibilityStartDatetime)
    : undefined

  const eligibilityEndDatetime = props.eligibilityEndDatetime
    ? new Date(props.eligibilityEndDatetime)
    : undefined

  const moduleBannerWording = isUserUnderage ? 'Profite de ton crédit' : `Profite de ${deposit}`

  const endDate = eligibilityEndDatetime
    ? formatToSlashedFrenchDate(eligibilityEndDatetime.toISOString())
    : undefined

  const NonBeneficiaryBanner = () => {
    if (props.isEligibleForBeneficiaryUpgrade) {
      if (subscription?.nextSubscriptionStep) {
        return (
          <BannerContainer>
            <View testID="eligibility-banner-container">
              {!!eligibilityEndDatetime && (
                <Caption>Tu as jusqu’au {endDate} pour faire ta demande</Caption>
              )}
              {!!nextBeneficiaryValidationStepNavConfig && (
                <ModuleBanner
                  navigateTo={nextBeneficiaryValidationStepNavConfig}
                  leftIcon={<ThumbUp />}
                  title={moduleBannerWording}
                  subTitle="à dépenser dans l'application"
                  testID="eligibility-banner"
                />
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
      if (props.subscriptionMessage) {
        return (
          <BannerContainer>
            <SubscriptionMessageBadge subscriptionMessage={props.subscriptionMessage} />
          </BannerContainer>
        )
      }
    }
    if (eligibilityStartDatetime && eligibilityStartDatetime > today) {
      return (
        <BannerContainer>
          <YoungerBadge eligibilityStartDatetime={eligibilityStartDatetime} />
        </BannerContainer>
      )
    }
    return <React.Fragment />
  }

  if (error) {
    throw error
  }

  return (
    <React.Fragment>
      <PageHeader title="Profil" size="medium" />
      <NonBeneficiaryBanner />
    </React.Fragment>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

const BannerContainer = styled.View({
  padding: getSpacing(4),
  paddingBottom: 0,
  position: 'relative',
})

const Caption = styled(Typo.Caption)({ marginBottom: getSpacing(2) })
