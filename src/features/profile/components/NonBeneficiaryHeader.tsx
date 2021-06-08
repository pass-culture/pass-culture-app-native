import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { useDepositAmount } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useNavigateToIdCheck } from 'features/idcheck/hooks/useNavigateToIdCheck'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { IdCheckProcessingBadge } from 'features/profile/components/IdCheckProcessingBadge'
import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { analytics } from 'libs/analytics'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { errorMonitoring } from 'libs/errorMonitoring'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { NonEligibleDepartmentBadge } from './NonEligibleDepartmentBadge'

interface NonBeneficiaryHeaderProps {
  email: string
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
  hasCompletedIdCheck?: boolean | null
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const today = new Date()
  const depositAmount = useDepositAmount()
  const { showErrorSnackBar } = useSnackBarContext()
  const { data: settings } = useAppSettings()

  const deposit = depositAmount.replace(' ', '')
  const eligibilityStartDatetime = props.eligibilityStartDatetime
    ? new Date(props.eligibilityStartDatetime)
    : undefined
  const eligibilityEndDatetime = props.eligibilityEndDatetime
    ? new Date(props.eligibilityEndDatetime)
    : undefined

  const isEligible =
    eligibilityStartDatetime && eligibilityEndDatetime
      ? today >= eligibilityStartDatetime && today < eligibilityEndDatetime
      : false

  function navigateToIdCheckUnavailable() {
    navigate('IdCheckUnavailable')
  }

  const navigateToIdCheck = useNavigateToIdCheck({
    onIdCheckNavigationBlocked: navigateToIdCheckUnavailable,
  })

  async function onIdCheckPress() {
    if (isEligible && settings?.allowIdCheckRegistration) {
      try {
        analytics.logIdCheck('Profile')
        navigateToIdCheck(props.email)
      } catch (err) {
        errorMonitoring.captureException(err, {
          isEligible,
        })
        showErrorSnackBar({
          message: t`Désolé, tu as effectué trop de tentatives. Essaye de nouveau dans 12 heures.`,
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
    } else {
      navigateToIdCheckUnavailable()
    }
  }

  let body = null
  if (!eligibilityStartDatetime || !eligibilityEndDatetime) {
    body = (
      <BodyContainer testID="body-container-above-18-not-eligible-department">
        <NonEligibleDepartmentBadge />
      </BodyContainer>
    )
  } else if (today >= eligibilityEndDatetime) {
    body = <BodyContainer testID="body-container-above-18" padding={1} />
  } else if (today >= eligibilityStartDatetime) {
    if (!props.hasCompletedIdCheck) {
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
            onPress={onIdCheckPress}
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
