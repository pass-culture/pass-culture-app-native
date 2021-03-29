import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useElementWidth } from 'ui/hooks/useElementWidth'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  title: string
  RightComponent?: React.FC
  onGoBack?: () => void
}

interface HeaderIconProps {
  onGoBack?: () => void
}

const HeaderIconBack: React.FC<HeaderIconProps> = ({ onGoBack }) => {
  const { goBack } = useNavigation<UseNavigationType>()
  function onPress() {
    if (onGoBack) {
      return onGoBack()
    }
    goBack()
  }
  return (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={onPress}>
      <ArrowPrevious color={ColorsEnum.WHITE} testID="icon-back" />
    </TouchableOpacity>
  )
}

export const PageHeader: React.FC<Props> = (props) => {
  const { title, RightComponent } = props
  const { onLayout } = useElementWidth()

  return (
    <HeaderContainer>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={2} />

      <Row>
        <IconContainer positionInHeader="left">
          <HeaderIconBack onGoBack={props.onGoBack} />
        </IconContainer>

        <Title color={ColorsEnum.WHITE}>{title}</Title>

        <IconContainer positionInHeader="right">
          {RightComponent && (
            <View onLayout={onLayout}>
              <RightComponent />
            </View>
          )}
        </IconContainer>
      </Row>

      <Spacer.Column numberOfSpaces={2} />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View({
  position: 'absolute',
  top: 0,
  width: '100%',
  backgroundColor: ColorsEnum.PRIMARY,
})

const Title = styled(Typo.Body).attrs({ numberOfLines: 1, color: ColorsEnum.WHITE })({
  flex: 1,
  textAlign: 'center',
})

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const IconContainer = styled.View<{ positionInHeader: 'left' | 'right' }>(
  ({ positionInHeader = 'left' }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: positionInHeader === 'left' ? 'flex-start' : 'flex-end',
    width: getSpacing(15),
    paddingLeft: getSpacing(3),
    paddingRight: getSpacing(3),
  })
)
