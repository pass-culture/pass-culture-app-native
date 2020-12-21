import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { LoadingPage } from 'ui/components/LoadingPage'
import { Spacer } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'IdCheck'>

export const IdCheck: React.FC<Props> = function (props) {
  const { email, licenceToken } = props.route.params
  const uri = `${env.ID_CHECK_URL}/?email=${email}&licence_token=${licenceToken}`
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <WebView
        testID="idcheck-webview"
        source={{ uri }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => <LoadingPage />}
      />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  webview: { overflow: 'hidden', flex: 1 },
})
