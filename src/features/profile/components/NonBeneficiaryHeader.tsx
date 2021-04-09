import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { memo, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { useDepositAmount, useGetIdCheckToken } from 'features/auth/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { formatToSlashedFrenchDate } from 'libs/dates'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { YoungerBadge } from './YoungerBadge'

interface NonBeneficiaryHeaderProps {
  email: string
  eligibilityStartDatetime: string
  eligibilityEndDatetime: string
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const today = new Date()
  const depositAmount = useDepositAmount()
  const deposit = depositAmount.replace(' ', '')
  const eligibilityStartDatetime = new Date(props.eligibilityStartDatetime)
  const eligibilityEndDatetime = new Date(props.eligibilityEndDatetime)

  const isEligible = today >= eligibilityStartDatetime && today < eligibilityEndDatetime
  const { data } = useGetIdCheckToken(isEligible)
  const licenceToken = data?.token || ''

  let body = null
  if (today >= eligibilityEndDatetime) {
    body = <BodyContainer testID="body-container-above-18" padding={1} />
  } else if (today >= eligibilityStartDatetime) {
    body = (
      <BodyContainer testID="body-container-18">
        <Typo.Caption>
          {t`Tu es éligible jusqu'au\u00a0${formatToSlashedFrenchDate(
            eligibilityEndDatetime.toISOString()
          )}`}
        </Typo.Caption>
        <Spacer.Column numberOfSpaces={1} />
        <ModuleBanner
          onPress={() => {
            analytics.logIdCheck('Profile')
            navigate('IdCheck', { email: props.email, licenceToken })
          }}
          leftIcon={<ThumbUp size={68} />}
          title={t`Profite de ${deposit}`}
          subTitle={t`à dépenser dans l'application`}
          testID="18-banner"
        />
      </BodyContainer>
    )
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
