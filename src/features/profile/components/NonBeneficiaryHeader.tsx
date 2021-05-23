import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { memo, PropsWithChildren, useState } from 'react'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { useDepositAmount } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { DenyAccessToIdCheckModal } from 'features/auth/signup/idCheck/DenyAccessToIdCheck'
import { useNavigateToIdCheck } from 'features/auth/signup/idCheck/useNavigateToIdCheck'
import { IdCheckProcessingBadge } from 'features/profile/components/IdCheckProcessingBadge'
import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { analytics } from 'libs/analytics'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { errorMonitoring } from 'libs/errorMonitoring'
import { storage } from 'libs/storage'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { NonEligibleDepartmentBadge } from './NonEligibleDepartmentBadge'

interface NonBeneficiaryHeaderProps {
  email: string
  eligibilityStartDatetime?: string
  eligibilityEndDatetime?: string
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const {
    visible: denyAccessToIdCheckModalVisible,
    showModal: showDenyAccessToIdCheckModal,
    hideModal: hideDenyAccessToIdCheckModal,
  } = useModal(false)
  const [hasCompletedIdCheck, setHasCompletedIdCheck] = useState(false)
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

  // NOTE: we comment here because react query throw to error boundary because of 400 and this should not query token on focus!!
  // const { data } = useGetIdCheckToken(isEligible, onIdCheckError)
  // const licenceToken = data?.token || ''
  const navigateToIdCheck = useNavigateToIdCheck({
    onIdCheckNavigationBlocked: showDenyAccessToIdCheckModal,
  })

  async function onIdCheckPress() {
    if (isEligible && settings?.allowIdCheckRegistration) {
      try {
        const response = await api.getnativev1idCheckToken()
        analytics.logIdCheck('Profile')
        if (response?.token != null) {
          navigateToIdCheck(props.email, response?.token)
        }
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
      showDenyAccessToIdCheckModal()
    }
  }
  useFocusEffect(() => {
    storage.readObject('has_completed_idcheck').then((value) => {
      setHasCompletedIdCheck(Boolean(value))
    })
  })

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
    if (!hasCompletedIdCheck) {
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
      <DenyAccessToIdCheckModal
        visible={denyAccessToIdCheckModalVisible}
        dismissModal={hideDenyAccessToIdCheckModal}
      />
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
