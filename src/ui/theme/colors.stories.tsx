import Clipboard from '@react-native-clipboard/clipboard'
import { ComponentStory } from '@storybook/react'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { TypoDS, getSpacing } from 'ui/theme'

import { ColorsEnum, UniqueColors } from './colors'

export default {
  title: 'Fondations/Colors',
}

type RectangleProps = {
  color: string
}

type ColorProps = RectangleProps & {
  name: string
}

const Template: ComponentStory<React.FC> = () => (
  <React.Fragment>
    <TypoDS.Title2>ColorsEnum</TypoDS.Title2>
    <ColorsSection colorsPalette={ColorsEnum} />
    <TypoDS.Title2>UniqueColors</TypoDS.Title2>
    <ColorsSection colorsPalette={UniqueColors} />
  </React.Fragment>
)
export const AllColors = Template.bind({})
AllColors.storyName = 'Colors'

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
      <TypoDS.BodyAccentXs>{name}</TypoDS.BodyAccentXs>
      <TypoDS.BodyXs>{color}</TypoDS.BodyXs>
    </ColorContainer>
  )
}

const ColorContainer = styled.View({
  margin: getSpacing(5),
})

const Rectangle = styled.TouchableOpacity<RectangleProps>(({ color }) => ({
  height: getSpacing(15),
  width: getSpacing(45),
  backgroundColor: color,
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
  marginBottom: getSpacing(2),
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledTitle4 = styled(TypoDS.Title4)(({ theme }) => ({
  position: 'absolute',
  color: theme.colors.greenValid,
  backgroundColor: theme.colors.white,
  padding: getSpacing(2),
  borderRadius: getSpacing(1),
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
