import React from 'react'
import WebView from 'react-native-webview'
import styled from 'styled-components/native'
import { useRoute } from '@react-navigation/native'
import { UseRouteType } from 'features/navigation/RootNavigator'

export const IdentityCheckWebview: React.FC = () => {
  const { params } = useRoute<UseRouteType<'IdentityCheckWebview'>>()

  return (
    <StyledWebview source={{ uri: params.identificationUrl }} testID="identity-check-webview" />
  )
}

const StyledWebview = styled(WebView)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
}))
