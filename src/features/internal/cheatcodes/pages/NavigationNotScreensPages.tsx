import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { Row } from 'features/internal/cheatcodes/components/Row'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'
import { BrowserNotSupportedPage } from 'web/SupportedBrowsersGate'

enum Page {
  BrowserNotSupportedPage = 'BrowserNotSupportedPage',
}

const doNothing = () => {
  /* do nothing */
}

const mapPageToComponent: Record<Page, JSX.Element> = {
  [Page.BrowserNotSupportedPage]: <BrowserNotSupportedPage onPress={doNothing} />,
}

export function NavigationNotScreensPages(): JSX.Element {
  const [page, setPage] = useState<Page | null>(null)

  if (page) {
    return mapPageToComponent[page]
  }
  return (
    <ScrollView>
      <PageHeaderSecondary title="Pages qui ne sont pas des écrans (tech)" />
      <StyledContainer>
        <Row half>
          <ButtonPrimary
            wording="BrowserNotSupportedPage"
            onPress={() => setPage(Page.BrowserNotSupportedPage)}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
