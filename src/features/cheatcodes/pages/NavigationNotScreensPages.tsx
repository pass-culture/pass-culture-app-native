import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'
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
  const { goBack } = useGoBack('Navigation', undefined)

  const [page, setPage] = useState<Page | null>(null)

  if (page) {
    return mapPageToComponent[page]
  }
  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="Pages qui ne sont pas des écrans (tech)"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
      />
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

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
