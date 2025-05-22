import React, { useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { BrowserNotSupportedPage, supportedBrowsers } from 'web/SupportedBrowsersGate'

enum Page {
  BrowserNotSupportedPage = 'BrowserNotSupportedPage',
}

const doNothing = () => {
  /* do nothing */
}

const browserVersion = Number(DeviceDetect.browserVersion)

const mapPageToComponent: Record<Page, React.JSX.Element> = {
  [Page.BrowserNotSupportedPage]: (
    <BrowserNotSupportedPage
      onPress={doNothing}
      browserVersion={browserVersion}
      supportedBrowsers={supportedBrowsers}
    />
  ),
}

export function CheatcodesNavigationNotScreensPages(): React.JSX.Element {
  const [page, setPage] = useState<Page | null>(null)

  if (page) return mapPageToComponent[page]

  return (
    <CheatcodesTemplateScreen title="Pages qui ne sont pas des écrans ❌">
      <LinkToScreen
        title="BrowserNotSupportedPage"
        onPress={() => setPage(Page.BrowserNotSupportedPage)}
      />
    </CheatcodesTemplateScreen>
  )
}
