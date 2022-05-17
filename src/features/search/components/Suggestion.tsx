import React from 'react'
import styled from 'styled-components/native'

import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Again } from 'ui/svg/icons/Again'
import { getSpacing, Typo } from 'ui/theme'

type SuggestionProps = {
  suggestion: string
}

export const Suggestion: React.FC<SuggestionProps> = ({ suggestion }) => {
  return (
    <TouchableLink>
      <Container>
        <AgainIcon />
        <StyledBody>{suggestion}</StyledBody>
      </Container>
    </TouchableLink>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: getSpacing(4),
  marginHorizontal: getSpacing(6),
})

const AgainIcon = styled(Again).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const StyledBody = styled(Typo.Body)({
  marginLeft: getSpacing(2),
})
