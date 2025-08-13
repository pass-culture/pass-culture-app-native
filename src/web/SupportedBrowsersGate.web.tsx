import React, { PropsWithChildren } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName, browserVersion } from 'react-device-detect'

import { BrowserNotSupportedPage } from 'web/BrowserNotSupportedPage.web'
import { supportedBrowsers } from 'web/supportedBrowsers'

const isBrowserSupported = () =>
  Object.entries(supportedBrowsers).some(
    ([name, version]) => browserName.includes(name) && Number(browserVersion) >= version
  )

export const SupportedBrowsersGate: React.FC<PropsWithChildren> = ({ children }) => {
  const userbrowserVersion = Number(browserVersion)
  const [shouldDisplayApp, setShouldDisplayApp] = React.useState(() => isBrowserSupported())

  if (!shouldDisplayApp) {
    return (
      <BrowserNotSupportedPage
        browserVersion={userbrowserVersion}
        supportedBrowsers={supportedBrowsers}
        onPress={() => setShouldDisplayApp(true)}
      />
    )
  }
  return <React.Fragment>{children}</React.Fragment>
}
