import React, { createContext } from 'react'
import CodePush from 'react-native-code-push' // @codepush

interface CodePushContext {
  status: null | CodePush.SyncStatus
}

const codePushOptionsAuto = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

const CodePushWrapper = (AppComponent: React.Component) =>
  CodePush(codePushOptionsAuto)(AppComponent)

// @ts-ignore no-param
const CodePushContext = createContext<CodePushContext>({})

export const CodePushProvider = CodePushWrapper(
  // @ts-ignore no-param
  class App extends React.Component<Record<string, unknown>, CodePushContext> {
    state = {
      status: null,
    }

    codePushStatusDidChange(nextStatus: CodePush.SyncStatus) {
      /* The other parts of our code rely on the fact that the code push sync status does not change once it is up-to-date */
      if (isUpToDate(nextStatus) && !isUpToDate(this.state.status)) {
        this.setState({
          status: nextStatus,
        })
      }
    }

    render() {
      return (
        <CodePushContext.Provider value={this.state}>
          {isUpToDate(this.state.status) && this.props.children}
        </CodePushContext.Provider>
      )
    }
  }
)

function isUpToDate(status: null | CodePush.SyncStatus) {
  return status === CodePush.SyncStatus.UP_TO_DATE
}

export default CodePushProvider
