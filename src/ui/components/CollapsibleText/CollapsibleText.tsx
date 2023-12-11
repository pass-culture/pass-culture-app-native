import React, { useCallback, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

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
  lineHeight: number
  isExpandedByDefault?: boolean
}

export function CollapsibleText({
  text,
  numberOfLines,
  lineHeight,
  isExpandedByDefault = false,
}: Readonly<Props>) {
  const [expanded, setExpanded] = useState(isExpandedByDefault)
  const [shouldDisplayButton, setShouldDisplayButton] = useState(false)

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
