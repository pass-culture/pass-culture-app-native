import React from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const browserVersion = Number(DeviceDetect.browserVersion)

const isFacebookMessenger = !!(
  navigator?.userAgent?.match?.(/(iPod|iPhone|iPad)/) && navigator?.userAgent?.match?.(/FBAV/i)
)

export const SupportedBrowsersGate: React.FC = ({ children }) => {
  const [shouldDisplayApp, setShouldDisplayApp] = React.useState(() => isBrowserSupported())

  if (!shouldDisplayApp) {
    return <BrowserNotSupportedPage onPress={() => setShouldDisplayApp(true)} />
  }
  return <React.Fragment>{children}</React.Fragment>
}

const supportedBrowsers: Array<{
  browser: string
  active: boolean
  version: number
}> = [
  { browser: 'Facebook Messenger', active: isFacebookMessenger, version: 1 },
  { browser: 'Chrome', active: DeviceDetect.isChrome, version: 50 },
  { browser: 'Safari sur iOS', active: DeviceDetect.isMobileSafari, version: 12 },
  { browser: 'Safari sur macOS', active: DeviceDetect.isSafari, version: 10 },
  { browser: 'Firefox', active: DeviceDetect.isFirefox, version: 55 },
  { browser: 'Edge sur Windows', active: DeviceDetect.isEdge, version: 79 },
  { browser: 'Opera', active: DeviceDetect.isOpera && DeviceDetect.isDesktop, version: 80 },
  { browser: 'Samsung', active: DeviceDetect.isSamsungBrowser, version: 5 },
  { browser: 'Instagram', active: DeviceDetect.browserName === 'Instagram', version: 200 },
  {
    browser: 'Les navigateurs basés sur Chromium (autre que Chrome)',
    active: DeviceDetect.isChromium,
    version: 0,
  },
]

function isBrowserSupported() {
  for (const supportedBrowser of supportedBrowsers) {
    if (supportedBrowser.active && browserVersion >= supportedBrowser.version) {
      return true
    }
  }
  return false
}

export const BrowserNotSupportedPage: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const title = `Oups\u00a0! Nous ne pouvons afficher correctement l'application car ton navigateur (${DeviceDetect.browserName} v${browserVersion}) n'est pas à jour`
  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      <Container>
        <Title>{title}</Title>
        <Spacer.Column numberOfSpaces={5} />
        <Typo.Body>
          Nous ne supportons pas certaines versions et/ou navigateurs qui ne permettraient pas une
          expérience optimale.
        </Typo.Body>
        <Spacer.Column numberOfSpaces={5} />
        <Typo.Body>
          Voici ceux que nous te conseillons pour profiter pleinement du pass Culture&nbsp;:
        </Typo.Body>
        <VerticalUl>
          {supportedBrowsers.map(({ browser, version }) => {
            let displayedMessage = `- ${browser}`
            if (version > 0) {
              displayedMessage += ` (version > ${version})`
            }
            return (
              <Li key={browser}>
                <StyledBody>{displayedMessage}</StyledBody>
              </Li>
            )
          })}
        </VerticalUl>
        <Spacer.Column numberOfSpaces={5} />
        <Typo.Caption>Mets vite à jour ton navigateur en allant dans les paramètres</Typo.Caption>
        <Spacer.Column numberOfSpaces={2} />
        <ButtonPrimary
          wording="J'accède au pass Culture sans mettre à jour mon navigateur"
          onPress={onPress}
          buttonHeight="tall"
          numberOfLines={2}
        />
      </Container>
    </ScrollView>
  )
}

const contentContainerStyle: ViewStyle = {
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}

const Container = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 520,
  padding: getSpacing(6),
})

const Title = styled(Typo.Title3)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  padding: getSpacing(5),
})
