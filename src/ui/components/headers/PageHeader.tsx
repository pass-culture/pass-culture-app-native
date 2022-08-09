import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar, View } from 'react-native'
import styled from 'styled-components/native'

import { BackButton } from 'ui/components/headers/BackButton'
import { useElementWidth } from 'ui/hooks/useElementWidth'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { Header } from 'ui/web/global/Header'

interface Props {
  title: string
  titleID?: string
  position?: 'relative' | 'absolute'
  // TODO(LucasBeneston): When we remove all primary or gradient header, remove this props
  background?: 'white' | 'primary' | 'gradient'
  size?: 'small' | 'medium'
  withGoBackButton?: boolean
  goBackAccessibilityLabel?: string
  onGoBack?: () => void
  RightComponent?: React.FC
}

const smallHeight = getSpacing(12)
const mediumHeight = getSpacing(14)

export const PageHeader: React.FC<Props> = ({
  title,
  titleID,
  position = 'relative',
  size = 'small',
  background = 'white',
  withGoBackButton = false,
  goBackAccessibilityLabel = t`Revenir en arrière`,
  onGoBack,
  RightComponent,
}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(background === 'white' ? 'dark-content' : 'light-content', true)
      return () =>
        StatusBar.setBarStyle(background === 'white' ? 'light-content' : 'dark-content', true)
    }, [background])
  )
  const { onLayout } = useElementWidth()
  const { top } = useCustomSafeInsets()
  const height = size === 'small' ? smallHeight : mediumHeight
  const backgroundColor = background === 'white' ? ColorsEnum.WHITE : ColorsEnum.PRIMARY
  const color = background === 'white' ? ColorsEnum.BLACK : ColorsEnum.WHITE
  const isAbsolutePosition = position === 'absolute' || !!withGoBackButton || !!RightComponent
  return (
    <Header>
      {!!isAbsolutePosition && <SpacerAbsolutePosition height={height + top} />}
      <ColorContainer backgroundColor={backgroundColor} isAbsolutePosition={isAbsolutePosition}>
        <Spacer.TopScreen />
        {background === 'gradient' && (
          <HeaderBackground height="100%" width="100%" position="absolute" />
        )}
        <Container size={size}>
          <Row>
            <ButtonContainer positionInHeader="left" testID={goBackAccessibilityLabel}>
              {!!withGoBackButton && <BackButton onGoBack={onGoBack} color={color} />}
            </ButtonContainer>
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
  ...(size === 'small' ? theme.typography.body : theme.typography.title4),
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
