import { t } from '@lingui/macro'
import React, { memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { BeneficiaryValidationStep } from 'api/gen'
import { useDepositAmount } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { IdCheckProcessingBadge } from 'features/profile/components/IdCheckProcessingBadge'
import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { formatToSlashedFrenchDate } from 'libs/dates'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface NonBeneficiaryHeaderProps {
  email: string
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
  nextBeneficiaryValidationStep?: BeneficiaryValidationStep | null
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const today = new Date()
  const depositAmount = useDepositAmount()
  const { error, navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()
  const prefetchedInfo = {
    email: props.email,
    nextBeneficiaryValidationStep: props.nextBeneficiaryValidationStep ?? null,
  }

  if (error) {
    throw error
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
    if (props.nextBeneficiaryValidationStep) {
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
            onPress={() => navigateToNextBeneficiaryValidationStep(prefetchedInfo)}
            leftIcon={<ThumbUp size={68} />}
            title={t({
              id: 'enjoy deposit',
              values: { deposit },
              message: 'Profite de {deposit}',
            })}
            subTitle={t`à dépenser dans l'application`}
            testID="18-banner"
          />
        </BodyContainer>
      )
    } else {
      body = (
        <BodyContainer testID="body-container-18-idcheck-completed">
          <IdCheckProcessingBadge />
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
