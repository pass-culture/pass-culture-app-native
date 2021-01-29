import { t } from '@lingui/macro'
import React, { memo, PropsWithChildren } from 'react'
import { Dimensions, View } from 'react-native'
import styled from 'styled-components/native'

import { dateDiffInFullYears, formatToSlashedFrenchDate } from 'libs/dates'
import { _ } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { computeEligibilityExpiracy } from '../utils'

import { YoungerBadge } from './YoungerBadge'

interface NonBeneficiaryHeaderProps {
  email: string
  dateOfBirth: string
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const age = dateDiffInFullYears(new Date(props.dateOfBirth), new Date())
  const expiracyDate = formatToSlashedFrenchDate(
    computeEligibilityExpiracy(props.dateOfBirth).toISOString()
  )

  let body = null
  switch (true) {
    case age > 18:
      body = null
      break
    case age === 18:
      body = (
        <View testID="18-view">
          <Typo.Caption>{_(t`Tu es éligible jusqu'au\u00a0${expiracyDate}`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
        </View>
      )
      break
    case age < 18:
      body = <YoungerBadge />
      break
  }

  return (
    <Container>
      <HeaderBackgroundWrapper>
        <HeaderBackground width={screenWidth} />
        <Title>{_(t`Profil`)}</Title>
      </HeaderBackgroundWrapper>
      <BodyContainer testID="body-container">{body}</BodyContainer>
    </Container>
  )
}

export const NonBeneficiaryHeader = memo(NonBeneficiaryHeaderComponent)

/** Add 1 pixel to avoid 1 white pixel on androids */
const screenWidth = Dimensions.get('window').width + 1

const Container = styled.View({
  flex: 1,
})

const HeaderBackgroundWrapper = styled.View({
  maxHeight: getSpacing(16),
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
})

const Title = styled(Typo.Title4)({
  position: 'absolute',
  top: getSpacing(8),
  color: ColorsEnum.WHITE,
})

const BodyContainer = styled.View({
  padding: getSpacing(4),
  position: 'relative',
  flex: 1,
})
