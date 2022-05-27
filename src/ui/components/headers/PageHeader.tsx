import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { HiddenText } from 'ui/components/HiddenText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { useElementWidth } from 'ui/hooks/useElementWidth'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { Header } from 'ui/web/global/Header'

interface Props {
  title: string
  titleID?: string
  RightComponent?: React.FC
  onGoBack?: () => void
}

interface HeaderIconProps {
  onGoBack?: () => void
}

const HeaderIconBack: React.FC<HeaderIconProps> = ({ onGoBack }) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <Touchable onPress={onGoBack || goBack} {...accessibilityAndTestId(t`Revenir en arrière`)}>
      <ArrowPrevious testID="icon-back" />
      <HiddenText>{t`Retour`}</HiddenText>
    </Touchable>
  )
}

export const PageHeader: React.FC<Props> = (props) => {
  const { title, titleID, RightComponent } = props
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

          <Title nativeID={titleID}>{title}</Title>

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

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``

const Container = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  backgroundColor: theme.colors.primary,
  zIndex: theme.zIndex.header,
}))

const Title = styled(Typo.Body).attrs(() => ({
  numberOfLines: 1,
  ...getHeadingAttrs(1),
}))(({ theme }) => ({
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
