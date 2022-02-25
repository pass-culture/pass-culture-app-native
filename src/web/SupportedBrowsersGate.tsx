import React from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native'

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
  message: string
  active: boolean
  version: number
}> = [
  { message: 'Facebook Messenger', active: isFacebookMessenger, version: 1 },
  { message: 'Chrome', active: DeviceDetect.isChrome, version: 50 },
  { message: 'Safari sur iOS', active: DeviceDetect.isMobileSafari, version: 12 },
  { message: 'Safari sur macOS', active: DeviceDetect.isSafari, version: 10 },
  { message: 'Firefox', active: DeviceDetect.isFirefox, version: 55 },
  { message: 'Edge sur Windows', active: DeviceDetect.isEdge, version: 79 },
  { message: 'Opera', active: DeviceDetect.isOpera && DeviceDetect.isDesktop, version: 80 },
  { message: 'Samsung', active: DeviceDetect.isSamsungBrowser, version: 5 },
  { message: 'Instagram', active: DeviceDetect.browserName === 'Instagram', version: 200 },
  {
    message: 'Les navigateurs basés sur Chromium (autre que Chrome)',
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
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContentContainer}>
      <View style={styles.content}>
        <Text
          style={
            styles.title
          }>{`Oups ! Nous ne pouvons afficher correctement l'application car ton navigateur (${DeviceDetect.browserName} v${browserVersion}) n'est pas à jour.`}</Text>
        <Text style={styles.text}>
          {`Nous ne supportons pas certaines versions et/ou navigateurs qui ne permettraient pas une expérience optimale.`}
        </Text>
        <Text style={styles.text}>
          {'Voici ceux que nous te conseillons pour profiter pleinement du pass Culture :'}
        </Text>
        <View style={styles.list}>
          {supportedBrowsers.map(({ message, version }) => {
            let displayedMessage = `- ${message}`
            if (version > 0) {
              displayedMessage += ` (version > ${version})`
            }
            return (
              <Text key={message} style={[styles.text, styles.listItemText]}>
                {displayedMessage}
              </Text>
            )
          })}
        </View>
        <Text style={styles.smallText}>
          {'Mets vite à jour ton navigateur en allant dans les paramètres.'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>
            {"Sans mettre à jour mon navigateur, j'accède au pass Culture"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
  },
  pageContentContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flexDirection: 'column', alignItems: 'center', maxWidth: 520, padding: 10 },
  list: { flexDirection: 'column', paddingBottom: 10 },
  listItemText: { paddingBottom: 6, textAlign: 'left' },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 16,
    textAlign: 'center',
  },
  text: { fontFamily: 'Montserrat-Regular', fontSize: 15, paddingBottom: 8, textAlign: 'left' },
  smallText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    paddingBottom: 8,
    textAlign: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#eb0055',
    width: 300,
    height: 50,
  },
  // eslint-disable-next-line react-native/no-color-literals
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
  },
})
