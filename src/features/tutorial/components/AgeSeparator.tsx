import React from 'react'
import styled from 'styled-components/native'

import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { getSpacing } from 'ui/theme'

export const AgeSeparator = ({ isEighteen }: { isEighteen: boolean }) => {
  const label = isEighteen ? 'pour les plus jeunes' : 'remise à 0 du crédit'
  return (
    <StyledContainer>
      <SeparatorWithText label={label} />
    </StyledContainer>
  )
}

const StyledContainer = styled.View({
  marginVertical: getSpacing(3.5),
})
