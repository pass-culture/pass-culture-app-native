import React, { useCallback, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { ArrowUp } from 'ui/svg/icons/ArrowUp'
import { Typo } from 'ui/theme'

type Props = {
  text: string
  // Minimum number of lines when collapsible is collapsed.
  numberOfLines: number
}

export function CollapsibleText({ text, numberOfLines }: Readonly<Props>) {
  const [expanded, setExpanded] = useState(false)
  const [shouldDisplayButton, setShouldDisplayButton] = useState(false)
  const theme = useTheme()
  const lineHeight = Number(theme.typography.body.lineHeight.slice(0, -2))

  const onPress = () => setExpanded((prevExpanded) => !prevExpanded)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const textHeight = event.nativeEvent.layout.height
      const maxTextHeight = lineHeight * numberOfLines

      setShouldDisplayButton(textHeight >= maxTextHeight)
    },
    [lineHeight, numberOfLines]
  )

  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const accessibilityLabel = expanded ? 'Réduire le texte' : 'Étendre le texte'
  const icon = expanded ? ArrowUp : ArrowDown

  return (
    <React.Fragment>
      <Typo.Body numberOfLines={expanded ? undefined : numberOfLines} onLayout={onLayout}>
        {highlightLinks(text)}
      </Typo.Body>
      {shouldDisplayButton ? (
        <ButtonContainer>
          <SeeMoreButton
            wording={buttonText}
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            icon={icon}
            buttonHeight="extraSmall"
          />
        </ButtonContainer>
      ) : null}
    </React.Fragment>
  )
}

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})

const SeeMoreButton = styledButton(ButtonTertiaryBlack)({
  maxWidth: 120,
})
