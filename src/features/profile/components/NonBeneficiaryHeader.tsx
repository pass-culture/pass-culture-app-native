import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { memo, PropsWithChildren, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SubscriptionMessage } from 'api/gen'
import { useDepositAmountsByAge } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { IdentityCheckPendingBadge } from 'features/profile/components/IdentityCheckPendingBadge'
import { SubscriptionMessageBadge } from 'features/profile/components/SubscriptionMessageBadge'
import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { useIsUserUnderage } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
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
  const { data: settings } = useAppSettings()
  const { data: subscription } = useNextSubscriptionStep()

  const { navigate } = useNavigation<UseNavigationType>()

  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)
  const isUserUnderage = useIsUserUnderage()

  function onBannerPress() {
    if (!isUserUnderage || settings?.enableUnderageGeneralisation) {
      navigateToNextBeneficiaryValidationStep()
      return
    }
    navigate('SelectSchoolHome')
  }

  const deposit = depositAmount.replace(' ', '')

  const eligibilityStartDatetime = props.eligibilityStartDatetime
    ? new Date(props.eligibilityStartDatetime)
    : undefined

  const eligibilityEndDatetime = props.eligibilityEndDatetime
    ? new Date(props.eligibilityEndDatetime)
    : undefined

  const moduleBannerWording = isUserUnderage
    ? t`Profite de ton crédit`
    : t({
        id: 'enjoy deposit',
        values: { deposit },
        message: 'Profite de {deposit}',
      })

  const NonBeneficiaryBanner = () => {
    if (props.isEligibleForBeneficiaryUpgrade) {
      if (subscription?.nextSubscriptionStep) {
        return (
          <View testID="eligibility-banner-container">
            {!!eligibilityEndDatetime && (
              <Caption>
                {t({
                  id: 'elibility deadline',
                  values: {
                    deadline: formatToSlashedFrenchDate(eligibilityEndDatetime.toISOString()),
                  },
                  message: `Tu es éligible jusqu'au {deadline}`,
                })}
              </Caption>
            )}
            <ModuleBanner
              onPress={onBannerPress}
              leftIcon={<ThumbUp size={68} />}
              title={moduleBannerWording}
              subTitle={t`à dépenser dans l'application`}
              testID="eligibility-banner"
            />
          </View>
        )
      }
      if (subscription?.hasIdentityCheckPending) {
        return <IdentityCheckPendingBadge />
      }
      if (props.subscriptionMessage) {
        return <SubscriptionMessageBadge subscriptionMessage={props.subscriptionMessage} />
      }
    }
    if (eligibilityStartDatetime && eligibilityStartDatetime > today) {
      return <YoungerBadge eligibilityStartDatetime={eligibilityStartDatetime} />
    }
    return <React.Fragment />
  }

  if (error) {
    throw error
  }

  return (
    <React.Fragment>
      <SvgPageHeader title={t`Profil`} />
      <BannerContainer>
        <NonBeneficiaryBanner />
      </BannerContainer>
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
