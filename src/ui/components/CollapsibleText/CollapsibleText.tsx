import React, { useState } from 'react'
import styled from 'styled-components/native'

import { parseMarkdown } from 'features/offer/helpers/parseMarkdown/parseMarkdown'
import { MarkdownPart } from 'features/offer/types'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { ArrowUp } from 'ui/svg/icons/ArrowUp'
import { TypoDS } from 'ui/theme'

import { useIsTextEllipsis } from './useIsTextEllipsis'

type Props = {
  children: string
  // Minimum number of lines when collapsible is collapsed.
  numberOfLines: number
  isMarkdown?: boolean
}

export function CollapsibleText({ children, numberOfLines, isMarkdown }: Readonly<Props>) {
  const [expanded, setExpanded] = useState(false)
  const {
    isTextEllipsis: shouldDisplayButton,
    onTextLayout,
    onLayout,
  } = useIsTextEllipsis(numberOfLines)

  const onPress = () => setExpanded((prevExpanded) => !prevExpanded)

  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const accessibilityLabel = expanded ? 'Réduire le texte' : 'Étendre le texte'
  const icon = expanded ? ArrowUp : ArrowDown

  const renderContent = () => {
    if (isMarkdown) {
      const parsedText: MarkdownPart[] = parseMarkdown(children)
      return parsedText.map(({ text, isBold, isItalic, isUnderline }, index) => (
        <StyledTypo
          key={index}
          isBold={isBold}
          isItalic={isItalic}
          isUnderline={isUnderline}
          testID="styledTypo">
          {highlightLinks(text)}
        </StyledTypo>
      ))
    }

    return highlightLinks(children)
  }

  return (
    <React.Fragment>
      <TypoDS.Body
        numberOfLines={expanded ? undefined : numberOfLines}
        onLayout={onLayout}
        onTextLayout={onTextLayout}>
        {renderContent()}
      </TypoDS.Body>
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

const StyledTypo = styled(TypoDS.Body)<{
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
}>(({ isBold, isItalic, isUnderline }) => ({
  fontWeight: isBold ? 'bold' : 'normal',
  fontStyle: isItalic ? 'italic' : 'normal',
  textDecorationLine: isUnderline ? 'underline' : 'none',
}))

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})

const SeeMoreButton = styledButton(ButtonTertiaryBlack)({
  maxWidth: 120,
})
