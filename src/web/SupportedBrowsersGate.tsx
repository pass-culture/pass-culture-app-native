import React, { PropsWithChildren } from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName, browserVersion } from 'react-device-detect'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'

// The following list was made manually using SauceLab. If it's been a while, feel free to make a new audit to update this list.
export const supportedBrowsers = {
  Chrome: 80,
  Firefox: 80,
  Edge: 80,
  Safari: 14,
} as const

type SupportedBrowsers = typeof supportedBrowsers

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

export const BrowserNotSupportedPage: React.FC<{
  browserVersion: number
  supportedBrowsers: SupportedBrowsers
  onPress: () => void
}> = ({ browserVersion, supportedBrowsers, onPress }) => {
  const title = `Oups\u00a0! Nous ne pouvons afficher correctement l’application car ton navigateur (${browserName} v${browserVersion}) n’est pas à jour`
  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      <Container>
        <ViewGap gap={5}>
          <Title>{title}</Title>
          <Typo.Body>
            Nous ne supportons pas certaines versions et/ou navigateurs qui ne permettraient pas une
            expérience optimale.
          </Typo.Body>
          <Typo.Body>
            Voici ceux que nous te conseillons pour profiter pleinement du pass Culture&nbsp;:
          </Typo.Body>
        </ViewGap>
        <VerticalUl>
          {Object.entries(supportedBrowsers).map(([browser, version]) => {
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
        <StyledViewGap gap={4}>
          <Typo.BodyAccent>
            Mets vite à jour ton navigateur en allant dans les paramètres&nbsp;!
          </Typo.BodyAccent>
          <Typo.BodyAccentXs>
            Tu peux néanmoins accèder au pass Culture, sans mettre à jour ton navigateur, avec le
            risque de ne pas bénéficier d’une expérience optimale&nbsp;:
          </Typo.BodyAccentXs>
        </StyledViewGap>
        <ButtonSecondary
          wording="Continuer quand même"
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

const StyledViewGap = styled(ViewGap)({
  marginTop: getSpacing(5),
  marginBottom: getSpacing(3),
})
