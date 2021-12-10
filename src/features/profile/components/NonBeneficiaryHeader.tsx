import { t } from '@lingui/macro'
import React, { memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { SubscriptionMessage } from 'api/gen'
import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { IdCheckProcessingBadge } from 'features/profile/components/IdCheckProcessingBadge'
import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { useIsUserUnderage } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
  lastUpdated?: string
  subscriptionMessage?: SubscriptionMessage | null
  isEligibleForBeneficiaryUpgrade?: boolean
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const today = new Date()
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit

  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()
  const isUserUnderage = useIsUserUnderage()

  function onBannerPress() {
    navigateToNextBeneficiaryValidationStep()
  }

  const deposit = depositAmount.replace(' ', '')
  const eligibilityStartDatetime = props.eligibilityStartDatetime
    ? new Date(props.eligibilityStartDatetime)
    : undefined
  const eligibilityEndDatetime = props.eligibilityEndDatetime
    ? new Date(props.eligibilityEndDatetime)
    : undefined

  let body = null
  if (!eligibilityStartDatetime || !eligibilityEndDatetime || today >= eligibilityEndDatetime) {
    body = <BodyContainer testID="body-container-above-18" padding={1} />
  } else if (today >= eligibilityStartDatetime) {
    if (props.isEligibleForBeneficiaryUpgrade && !props.subscriptionMessage) {
      const moduleBannerWording = isUserUnderage
        ? t({
            id: 'enjoy underage deposit',
            message: 'Profite de ton crédit',
          })
        : t({
            id: 'enjoy deposit',
            values: { deposit },
            message: 'Profite de {deposit}',
          })
      body = (
        <BodyContainer testID="body-container-18">
          <Typo.Caption>
            {t({
              id: 'elibility deadline',
              values: { deadline: formatToSlashedFrenchDate(eligibilityEndDatetime.toISOString()) },
              message: `Tu es éligible jusqu'au {deadline}`,
            })}
          </Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <ModuleBanner
            onPress={onBannerPress}
            leftIcon={<ThumbUp size={68} />}
            title={moduleBannerWording}
            subTitle={t`à dépenser dans l'application`}
            testID="eligibility-banner"
          />
        </BodyContainer>
      )
    } else {
      body = (
        <BodyContainer testID="body-container-18-idcheck-completed">
          <IdCheckProcessingBadge subscriptionMessage={props.subscriptionMessage} />
        </BodyContainer>
      )
    }
  } else {
    body = (
      <BodyContainer testID="body-container-under-18">
        <YoungerBadge />
      </BodyContainer>
    )
  }

  return (
    <React.Fragment>
      <SvgPageHeader title={t`Profil`} />
      {body}
    </React.Fragment>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

const BodyContainer = styled.View.attrs<{ padding?: number }>(({ padding }) => ({
  padding,
}))<{ padding?: number }>(({ padding }) => ({
  padding: getSpacing(padding || 4),
  paddingBottom: 0,
  position: 'relative',
}))
