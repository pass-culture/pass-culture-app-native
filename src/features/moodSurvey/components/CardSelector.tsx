import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import { ImageBackground } from 'react-native'
import styled from 'styled-components/native'

import { mapNameToImage } from 'features/moodSurvey/helpers/getImageFromName'
import { EmojiOption, MoodboardOption, PersonaOption } from 'features/moodSurvey/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  onPress: () => void
  title: EmojiOption | MoodboardOption | PersonaOption
}

export const CardSelector: FunctionComponent<Props> = ({ onPress, title }) => {
  return (
    <Container onPress={onPress}>
      <Background source={{ uri: mapNameToImage.get(title) }} resizeMode="cover">
        <TitleContainer>
          <Typo.ButtonText>{title}</Typo.ButtonText>
        </TitleContainer>
      </Background>
    </Container>
  )
}

const Container = styled(TouchableOpacity)({
  height: getSpacing(45),
  borderRadius: getSpacing(4),
  flex: 1,
  margin: getSpacing(1),
  justifyContent: 'flex-end',
  overflow: 'hidden',
})

const Background = styled(ImageBackground)({
  flex: 1,
  justifyContent: 'flex-end',
})

const TitleContainer = styled.View(({ theme }) => ({
  height: getSpacing(9),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.white,
  opacity: '80%',
}))
