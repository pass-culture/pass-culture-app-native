import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar, View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { BackButton } from 'ui/components/headers/BackButton'
import { useElementWidth } from 'ui/hooks/useElementWidth'
import { getSpacing, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  title: string
  titleID?: string
  position?: 'relative' | 'absolute'
  background?: 'white' | 'primary'
  size?: 'small' | 'medium'
  withGoBackButton?: boolean
  goBackAccessibilityLabel?: string
  onGoBack?: () => void
  RightComponent?: React.FC
  testID?: string
}

const smallHeight = getSpacing(12)
const mediumHeight = getSpacing(18)

export const PageHeader: React.FC<Props> = ({
  title,
  titleID,
  position = 'relative',
  size = 'small',
  background = 'white',
  withGoBackButton = false,
  goBackAccessibilityLabel = 'Revenir en arrière',
  onGoBack,
  RightComponent,
  testID,
}) => {
  const isWhiteBackground = background === 'white'
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(isWhiteBackground ? 'dark-content' : 'light-content', true)
      return () => StatusBar.setBarStyle(isWhiteBackground ? 'light-content' : 'dark-content', true)
    }, [isWhiteBackground])
  )
  const { onLayout } = useElementWidth()
  const { top } = useCustomSafeInsets()
  const height = size === 'small' ? smallHeight : mediumHeight
  const backgroundColor = isWhiteBackground ? ColorsEnum.WHITE : ColorsEnum.PRIMARY
  const color = isWhiteBackground ? ColorsEnum.BLACK : ColorsEnum.WHITE
  const isAbsolutePosition = position === 'absolute' || !!withGoBackButton || !!RightComponent
  return (
    <Header>
      {!!isAbsolutePosition && <SpacerAbsolutePosition height={height + top} />}
      <ColorContainer
        backgroundColor={backgroundColor}
        isAbsolutePosition={isAbsolutePosition}
        testID={testID}>
        <Spacer.TopScreen />
        <Container size={size}>
          <Row>
            {isAbsolutePosition ? (
              <ButtonContainer positionInHeader="left" testID={goBackAccessibilityLabel}>
                {!!withGoBackButton && <BackButton onGoBack={onGoBack} color={color} />}
              </ButtonContainer>
            ) : (
              <Spacer.Row numberOfSpaces={6} />
            )}
            <Title nativeID={titleID} color={color} size={size}>
              {title}
            </Title>
            <ButtonContainer positionInHeader="right">
              {!!RightComponent && (
                <View onLayout={onLayout}>
                  <RightComponent />
                </View>
              )}
            </ButtonContainer>
          </Row>
        </Container>
      </ColorContainer>
    </Header>
  )
}

const ColorContainer = styled.View<{ backgroundColor?: ColorsEnum; isAbsolutePosition?: boolean }>(
  ({ backgroundColor, isAbsolutePosition, theme }) => ({
    ...(isAbsolutePosition
      ? {
          zIndex: theme.zIndex.header,
          position: 'absolute',
          top: 0,
        }
      : {}),
    width: '100%',
    backgroundColor,
  })
)

const SpacerAbsolutePosition = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const Container = styled.View<{ size?: string }>(({ size }) => ({
  alignItems: 'center',
  ...(size === 'small'
    ? {
        height: smallHeight,
        justifyContent: 'center',
      }
    : {
        height: mediumHeight,
        justifyContent: 'flex-end',
        paddingBottom: getSpacing(3),
      }),
}))

const Title = styled.Text.attrs(() => ({
  numberOfLines: 1,
  ...getHeadingAttrs(1),
}))<{ color: ColorsEnum; size?: string }>(({ theme, color, size }) => ({
  ...(size === 'small' ? theme.typography.body : theme.typography.title1),
  textAlign: 'center',
  color,
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
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

const Header: React.FC = styled.View.attrs({
  accessibilityRole: AccessibilityRole.HEADER,
})({
  width: '100%',
})
