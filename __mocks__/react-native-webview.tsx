import React, { forwardRef, useImperativeHandle, Ref, createRef } from 'react'
import { View } from 'react-native'

export interface MockWebViewRef {
  injectJavaScript: jest.Mock
  goBack: jest.Mock
  reload: jest.Mock
}

export interface MockWebViewProps {
  testID?: string
  [key: string]: unknown
}

export const WebView = forwardRef(function WebView(
  props: MockWebViewProps,
  ref: Ref<MockWebViewRef>
) {
  const localRef = createRef<View>()
  useImperativeHandle(ref, () => ({
    injectJavaScript: jest.fn(),
    goBack: jest.fn(),
    reload: jest.fn(),
  }))

  return <View ref={localRef} {...props} testID={props.testID ?? 'mock-webview'} />
})

export default WebView

export const WebViewMessageEvent = {}
export const WebViewNavigation = {}
export const WebViewProps = {}
