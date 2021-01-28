import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { memo, PropsWithChildren } from 'react'
import { Dimensions, View } from 'react-native'
import styled from 'styled-components/native'

import { useGetIdCheckToken } from 'features/auth/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { dateDiffInFullYears, formatToSlashedFrenchDate } from 'libs/dates'
import { _ } from 'libs/i18n'
import { ModuleBanner } from 'ui/components/ModuleBanner'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { computeEligibilityExpiracy } from '../utils'

import { YoungerBadge } from './YoungerBadge'

interface NonBeneficiaryHeaderProps {
  email: string
  dateOfBirth: string
}

function NonBeneficiaryHeaderComponent(props: PropsWithChildren<NonBeneficiaryHeaderProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const age = dateDiffInFullYears(new Date(props.dateOfBirth), new Date())
  const expiracyDate = formatToSlashedFrenchDate(
    computeEligibilityExpiracy(props.dateOfBirth).toISOString()
  )

  const shouldLoadIdCheckToken = age === 18
  const { data } = useGetIdCheckToken(shouldLoadIdCheckToken)
  const licenceToken = data?.token || ''

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
          <ModuleBanner
            onPress={() => navigate('IdCheck', { email: props.email, licenceToken })}
            leftIcon={<ThumbUp size={68} />}
            title={_(t`Profite de 300\u00a0€\u00a0`)}
            subTitle={_(t`à dépenser dans l'application`)}
            testID="18-banner"
          />
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
