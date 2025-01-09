import React, { PropsWithChildren } from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

type SupportedBrowsers = Array<{
  browser: string
  active: boolean
  version: number
}>

export const SupportedBrowsersGate: React.FC<PropsWithChildren> = ({ children }) => {
  const browserVersion = Number(DeviceDetect.browserVersion)
  const supportedBrowsers: SupportedBrowsers = [
    { browser: 'Chrome', active: DeviceDetect.isChrome, version: 80 },
    { browser: 'Firefox', active: DeviceDetect.isFirefox, version: 80 },
    { browser: 'Edge sur Windows', active: DeviceDetect.isEdge, version: 80 },
    { browser: 'Safari sur macOS', active: DeviceDetect.isSafari, version: 14 },
  ]

  const [shouldDisplayApp, setShouldDisplayApp] = React.useState(() =>
    isBrowserSupported(browserVersion, supportedBrowsers)
  )

  if (!shouldDisplayApp) {
    return (
      <BrowserNotSupportedPage
        browserVersion={browserVersion}
        supportedBrowsers={supportedBrowsers}
        onPress={() => setShouldDisplayApp(true)}
      />
    )
  }
  return <React.Fragment>{children}</React.Fragment>
}

function isBrowserSupported(browserVersion: number, supportedBrowsers: SupportedBrowsers) {
  for (const supportedBrowser of supportedBrowsers) {
    if (supportedBrowser.active && browserVersion >= supportedBrowser.version) {
      return true
    }
  }
  return false
}

export const BrowserNotSupportedPage: React.FC<{
  browserVersion: number
  supportedBrowsers: SupportedBrowsers
  onPress: () => void
}> = ({ browserVersion, supportedBrowsers, onPress }) => {
  const title = `Oups\u00a0! Nous ne pouvons afficher correctement l’application car ton navigateur (${DeviceDetect.browserName} v${browserVersion}) n’est pas à jour`
  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      <Container>
        <Title>{title}</Title>
        <Spacer.Column numberOfSpaces={5} />
        <TypoDS.Body>
          Nous ne supportons pas certaines versions et/ou navigateurs qui ne permettraient pas une
          expérience optimale.
        </TypoDS.Body>
        <Spacer.Column numberOfSpaces={5} />
        <TypoDS.Body>
          Voici ceux que nous te conseillons pour profiter pleinement du pass Culture&nbsp;:
        </TypoDS.Body>
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
        <TypoDS.BodyAccentXs>
          Mets vite à jour ton navigateur en allant dans les paramètres
        </TypoDS.BodyAccentXs>
        <Spacer.Column numberOfSpaces={2} />
        <ButtonPrimary
          wording="J’accède au pass Culture sans mettre à jour mon navigateur"
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

const Title = styled(TypoDS.Title3)({
  textAlign: 'center',
})

const StyledBody = styled(TypoDS.Body)({
  padding: getSpacing(5),
})
