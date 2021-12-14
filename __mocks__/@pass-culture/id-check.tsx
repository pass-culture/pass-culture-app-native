import React from 'react'
import { View } from 'react-native'

import { theme as idCheckTheme } from '../../src/theme'

const MockIdCheckErrorComponent = () => null

let actual
try {
  actual = jest.requireActual('@pass-culture/id-check')
} catch (error) {
  console.error(error)
}

export const useEduConnectClient = jest.fn().mockReturnValue(undefined)

export const useEduConnect = jest.fn().mockReturnValue(true)
export const useIdCheckContext = () => ({
  setContextValue: jest.fn(),
})

export const pages = {
  'unread-document': MockIdCheckErrorComponent,
  'unread-mrz-document': MockIdCheckErrorComponent,
  'invalid-document-date': MockIdCheckErrorComponent,
  'invalid-document': MockIdCheckErrorComponent,
  'invalid-twice': MockIdCheckErrorComponent,
  'no-remaining-tries': MockIdCheckErrorComponent,
  'invalid-age': MockIdCheckErrorComponent,
  'auth-token-expired': MockIdCheckErrorComponent,
  'auth-required': MockIdCheckErrorComponent,
  'validation-unavailable': MockIdCheckErrorComponent,
  'missing-document': MockIdCheckErrorComponent,
  'profile:incomplete': MockIdCheckErrorComponent,
  'native-camera-fail': MockIdCheckErrorComponent,
  'native-camera-shot-fail': MockIdCheckErrorComponent,
  'not-eligible': MockIdCheckErrorComponent,
}

export const initialRouteName = 'IdCheckV2'

export const routes = []

export const IdCheckContextProvider: React.FC = (props) => {
  return <View>{props.children}</View>
}

export const theme = idCheckTheme

export const Background = actual.Background
export const EduConnectError = actual.EduConnectError
export const EduConnectErrors = actual.EduConnectErrors
export const EduConnectErrorBoundary = actual.EduConnectErrorBoundary
