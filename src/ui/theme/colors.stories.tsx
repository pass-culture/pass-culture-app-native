import Clipboard from '@react-native-clipboard/clipboard'
import { StoryFn } from '@storybook/react-vite'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

import { ColorsEnum } from './colors'

export default {
  title: 'Fondations/Colors',
}

type RectangleProps = {
  color: string
}

type ColorProps = RectangleProps & {
  name: string
}

const Template: StoryFn<React.FC> = () => (
  <React.Fragment>
    <Typo.Title2>ColorsEnum</Typo.Title2>
    <ColorsSection colorsPalette={ColorsEnum} />
  </React.Fragment>
)
export const AllColors = {
  name: 'Colors',
  render: Template,
}

const Color: FunctionComponent<ColorProps> = ({ name, color }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const handleColorClick = (colorCode: string) => {
    Clipboard.setString(colorCode)
    setCopiedColor(colorCode)
    setTimeout(() => setCopiedColor(null), 1000)
  }

  return (
    <ColorContainer>
      <Rectangle color={color} onPress={() => handleColorClick(color)}>
        {copiedColor === color ? <StyledTitle4>Copié&nbsp;!</StyledTitle4> : null}
      </Rectangle>
      <Typo.BodyAccentXs>{name}</Typo.BodyAccentXs>
      <Typo.BodyXs>{color}</Typo.BodyXs>
    </ColorContainer>
  )
}

const ColorContainer = styled.View({
  margin: getSpacing(5),
})

const Rectangle = styled.TouchableOpacity<RectangleProps>(({ color, theme }) => ({
  height: getSpacing(15),
  width: getSpacing(45),
  backgroundColor: color,
  boxShadow: `0 0 5px ${colorAlpha(theme.designSystem.color.border.default, 0.2)}`,
  marginBottom: getSpacing(2),
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  position: 'absolute',
  color: theme.designSystem.color.text.success,
  backgroundColor: theme.designSystem.color.background.default,
  padding: getSpacing(2),
  borderRadius: theme.designSystem.size.borderRadius.s,
  zIndex: 1,
}))

const ColorsSection = ({ colorsPalette }: { colorsPalette: Record<string, string> }) => (
  <Container>
    {Object.entries(colorsPalette).map(([name, color]) => (
      <Color key={name} name={name} color={color} />
    ))}
  </Container>
)

const Container = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
