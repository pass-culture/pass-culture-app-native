import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const FAQWebview: React.FC = () => {
  const headerHeight = useGetHeaderHeight()
  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Traitement des données utilisateurs" />
      <Placeholder height={headerHeight} />
      <WebView source={{ uri: FAQ_LINK_USER_DATA }} testID="FAQ-webview" />
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
