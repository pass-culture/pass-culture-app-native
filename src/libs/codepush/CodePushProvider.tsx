import React, { createContext, useContext } from 'react'
import CodePush from 'react-native-code-push' // @codepush

import { env } from 'libs/environment'

interface CodePushContext {
  status: null | CodePush.SyncStatus
}

const codePushOptionsAuto = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

// @codepush
const shouldWrapWithCodePush = env.FEATURE_FLAG_CODE_PUSH

const CodePushWrapper = (AppComponent: React.Component) =>
  shouldWrapWithCodePush ? CodePush(codePushOptionsAuto)(AppComponent) : AppComponent

// @ts-ignore no-param
const CodePushContext = createContext<CodePushContext>({})

export const useCodePush = () => useContext<CodePushContext>(CodePushContext)

export const CodePushProvider = CodePushWrapper(
  // @ts-ignore no-param
  class App extends React.Component<Record<string, unknown>, CodePushContext> {
    state = {
      status: null,
    }

    codePushStatusDidChange(status: CodePush.SyncStatus) {
      this.setState({ status })
    }

    render() {
      return (
        <CodePushContext.Provider
          value={{
            status: this.state.status,
          }}>
          {this.props.children}
        </CodePushContext.Provider>
      )
    }
  }
)

export default CodePushProvider
