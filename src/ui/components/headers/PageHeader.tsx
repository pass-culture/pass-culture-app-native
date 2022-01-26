import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'tests/utils'
import { useElementWidth } from 'ui/hooks/useElementWidth'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { Header } from 'ui/web/global/Header'

interface Props {
  title: string
  RightComponent?: React.FC
  onGoBack?: () => void
}

interface HeaderIconProps {
  onGoBack?: () => void
}

const HeaderIconBack: React.FC<HeaderIconProps> = ({ onGoBack }) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <TouchableOpacity
      onPress={onGoBack || goBack}
      {...accessibilityAndTestId(t`Revenir en arrière`)}>
      <ArrowPrevious color={ColorsEnum.WHITE} size={24} testID="icon-back" />
    </TouchableOpacity>
  )
}

export const PageHeader: React.FC<Props> = (props) => {
  const { title, RightComponent } = props
  const { onLayout } = useElementWidth()

  return (
    <Header>
      <Container>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={2} />

        <Row>
          <ButtonContainer positionInHeader="left">
            <HeaderIconBack onGoBack={props.onGoBack} />
          </ButtonContainer>

          <Title color={ColorsEnum.WHITE}>{title}</Title>

          <ButtonContainer positionInHeader="right">
            {!!RightComponent && (
              <View onLayout={onLayout}>
                <RightComponent />
              </View>
            )}
          </ButtonContainer>
        </Row>

        <Spacer.Column numberOfSpaces={2} />
      </Container>
    </Header>
  )
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``

const Container = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  backgroundColor: theme.colors.primary,
}))

const Title = styled(Typo.Body).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ButtonContainer = styled.View<{ positionInHeader: 'left' | 'right' }>(
  ({ positionInHeader = 'left' }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: positionInHeader === 'left' ? 'flex-start' : 'flex-end',
    paddingLeft: getSpacing(3),
    paddingRight: getSpacing(3),
    flex: 1,
  })
)
