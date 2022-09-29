import React from 'react'
import styled from 'styled-components/native'

import { DeeplinkItem } from 'features/_marketingAndCommunication/atoms/DeeplinkItem'
import { GeneratedDeeplink } from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  result?: GeneratedDeeplink
}

export const DeeplinksResult = ({ result }: Props) => {
  return (
    <Container>
      <StyledTitle4>Votre lien</StyledTitle4>
      <Container>
        <ResultContainer>
          {!result ? (
            <CenteredContainer>
              <Typo.Body>Vous devez d’abord générer un lien</Typo.Body>
            </CenteredContainer>
          ) : (
            <DeeplinkItem deeplink={result} />
          )}
        </ResultContainer>
      </Container>
    </Container>
  )
}

const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})({
  paddingHorizontal: getSpacing(2),
  paddingVertical: getSpacing(4),
  maxHeight: 300,
})

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
