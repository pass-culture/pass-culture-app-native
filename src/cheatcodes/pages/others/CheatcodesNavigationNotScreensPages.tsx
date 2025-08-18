import React, { useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeButton } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { BrowserNotSupportedPage } from 'web/BrowserNotSupportedPage.web'
import { supportedBrowsers } from 'web/supportedBrowsers'

enum Page {
  BrowserNotSupportedPage = 'BrowserNotSupportedPage',
}

const browserVersion = Number(DeviceDetect.browserVersion)

// This function now takes an `onBack` handler to make the rendered page interactive.
const getPageComponent = (page: Page, onBack: () => void): React.JSX.Element => {
  if (page === Page.BrowserNotSupportedPage) {
    // We pass the onBack handler to the component's main action button.
    return (
      <BrowserNotSupportedPage
        onPress={onBack}
        browserVersion={browserVersion}
        supportedBrowsers={supportedBrowsers}
      />
    )
  }
  // This provides a fallback in case more pages are added.
  return <React.Fragment />
}

export function CheatcodesNavigationNotScreensPages(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const [page, setPage] = useState<Page | null>(null)

  // If a page is selected, render it and provide a way to get back.
  if (page) {
    return getPageComponent(page, () => setPage(null))
  }

  const actionButtons: CheatcodeButton[] = [
    {
      id: uuidv4(),
      title: 'BrowserNotSupportedPage',
      onPress: () => setPage(Page.BrowserNotSupportedPage),
    },
  ]

  // If no page is selected, render the list of buttons.
  return (
    <CheatcodesTemplateScreen title="Pages qui ne sont pas des écrans ❌" onGoBack={goBack}>
      {actionButtons.map((button) => (
        <LinkToCheatcodesScreen key={button.id} button={button} variant="secondary" />
      ))}
    </CheatcodesTemplateScreen>
  )
}
