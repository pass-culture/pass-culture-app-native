import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { LoadingPage } from 'ui/components/LoadingPage'

type Props = StackScreenProps<RootStackParamList, 'IdCheck'>

export const IdCheck: React.FC<Props> = function (props) {
  const { email, licenceToken } = props.route.params
  const uri = `${env.ID_CHECK_URL}/?email=${email}&licence_token=${licenceToken}`
  return (
    <StyledWebview
      testID="idcheck-webview"
      source={{ uri }}
      startInLoadingState={true}
      renderLoading={() => (
        <LoadingPageContainer>
          <LoadingPage />
        </LoadingPageContainer>
      )}
    />
  )
}

const StyledWebview = styled(WebView)({
  height: '100%',
  width: '100%',
})

const LoadingPageContainer = styled.View({
  height: '100%',
  width: '100%',
})
