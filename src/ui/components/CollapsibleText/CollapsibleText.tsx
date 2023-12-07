import React, { useState } from 'react'
import styled from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { ArrowUp } from 'ui/svg/icons/ArrowUp'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  text: string
  numberOfLines?: number
  isExpanded?: boolean
}

export function CollapsibleText({ text, numberOfLines = 5, isExpanded = false }: Readonly<Props>) {
  const [expanded, setExpanded] = useState(isExpanded)

  const onPress = () => setExpanded((prevExpanded) => !prevExpanded)

  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const accessibilityLabel = expanded ? 'Réduire le texte' : 'Étendre le texte'
  const icon = expanded ? ArrowUp : ArrowDown

  return (
    <React.Fragment>
      <Typo.Body numberOfLines={expanded ? undefined : numberOfLines}>
        {highlightLinks(text)}
      </Typo.Body>
      <ButtonContainer>
        <LocationButton
          wording={buttonText}
          onPress={onPress}
          accessibilityLabel={accessibilityLabel}
          icon={icon}
          buttonHeight="extraSmall"
        />
      </ButtonContainer>
    </React.Fragment>
  )
}

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: getSpacing(1),
})

const LocationButton = styledButton(ButtonTertiaryBlack)({
  maxWidth: 120,
})
