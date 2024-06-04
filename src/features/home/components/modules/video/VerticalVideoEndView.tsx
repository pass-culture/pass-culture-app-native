import colorAlpha from 'color-alpha'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { getSpacing } from 'ui/theme'

export const VerticalVideoEndView: React.FC<{
  onPressReplay: () => void
  style: StyleProp<ViewStyle>
}> = ({ onPressReplay, style }) => {
  return (
    <Container style={style}>
      <BlackView>
        <ButtonsWrapper>
          <ButtonsContainer>
            <ButtonWithCaption
              onPress={onPressReplay}
              accessibilityLabel="Revoir la vidéo"
              wording="Revoir la vidéo"
              icon={StyledReplayIcon}
            />
          </ButtonsContainer>
          <ButtonsContainer>
            <ButtonWithCaption
              onPress={onPressReplay}
              accessibilityLabel="Voir la vidéo suivante"
              wording="Voir la vidéo suivante"
              icon={StyledReplayIcon}
            />
          </ButtonsContainer>
        </ButtonsWrapper>
      </BlackView>
    </Container>
  )
}

const Container = styled(View)({
  position: 'absolute',
})

const ButtonsWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const ButtonsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  maxWidth: getSpacing(20),
  marginHorizontal: getSpacing(4),
})

const StyledReplayIcon = styled(ArrowAgain).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const BlackView = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.black, 0.7),
  height: '100%',
  justifyContent: 'center',
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
}))
