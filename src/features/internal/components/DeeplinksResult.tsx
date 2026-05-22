import React from 'react'
import styled from 'styled-components/native'

import { DeeplinkItem } from 'features/internal/atoms/DeeplinkItem'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { Typo, getSpacing } from 'ui/theme'

interface Props {
  result?: string
}

export const DeeplinksResult = ({ result }: Props) => {
  const resultContainer = (
    <ResultContainer>
      {result ? (
        <DeeplinkItem universalLink={result} />
      ) : (
        <CenteredContainer>
          <Typo.Body>Vous devez d’abord générer un lien</Typo.Body>
        </CenteredContainer>
      )}
    </ResultContainer>
  )

  return useMobileFontScaleToDisplay({
    //to do
    default: (
      <Container>
        <StyledTitle4>Votre lien</StyledTitle4>
        <Container>{resultContainer}</Container>
      </Container>
    ),
    at200PercentZoom: (
      <Container200>
        <StyledTitle4>Votre lien</StyledTitle4>
        <Container200>{resultContainer}</Container200>
      </Container200>
    ),
  })
}
const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.s,
  paddingVertical: theme.designSystem.size.spacing.l,
  maxHeight: getSpacing(75),
}))

const Container200 = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.s,
  paddingVertical: theme.designSystem.size.spacing.l,
  flexGrow: 1,
}))

const ResultContainer = styled.View({
  flex: 1,
  alignItems: 'flex-start',
})

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})

const CenteredContainer = styled.View({
  flex: 1,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})
