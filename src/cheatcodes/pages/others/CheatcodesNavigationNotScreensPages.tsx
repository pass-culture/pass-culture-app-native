import React, { useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { BrowserNotSupportedPage } from 'web/SupportedBrowsersGate'

enum Page {
  BrowserNotSupportedPage = 'BrowserNotSupportedPage',
}

const doNothing = () => {
  /* do nothing */
}

const messengerBrowserRegex = new RegExp(/FBA[VN]/i)
const isFacebookMessenger = !!messengerBrowserRegex.exec(navigator?.userAgent)
const browserVersion = Number(DeviceDetect.browserVersion)
const supportedBrowsers = [
  { browser: 'Facebook Messenger', active: isFacebookMessenger, version: 1 },
  { browser: 'Chrome', active: DeviceDetect.isChrome, version: 50 },
  { browser: 'Safari sur iOS', active: DeviceDetect.isMobileSafari, version: 12 },
  { browser: 'Safari sur macOS', active: DeviceDetect.isSafari, version: 10 },
  { browser: 'Firefox', active: DeviceDetect.isFirefox, version: 55 },
  { browser: 'Edge sur Windows', active: DeviceDetect.isEdge, version: 79 },
  { browser: 'Opera', active: DeviceDetect.isOpera && DeviceDetect.isDesktop, version: 80 },
  { browser: 'Samsung', active: DeviceDetect.isSamsungBrowser, version: 5 },
  { browser: 'Instagram', active: DeviceDetect.browserName === 'Instagram', version: 200 },
  { browser: 'Brave', active: DeviceDetect.browserName === 'Brave', version: 98 },
  {
    browser: 'Les navigateurs basés sur Chromium (autre que Chrome et Brave)',
    active: DeviceDetect.isChromium,
    version: 0,
  },
]
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
