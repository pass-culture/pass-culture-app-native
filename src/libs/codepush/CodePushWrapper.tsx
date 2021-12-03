import { useEffect } from 'react'
import CodePush, { CodePushOptions } from 'react-native-code-push' // @codepush

import { env } from 'libs/environment'

// useful for testing and staging environments
// to get the up-to-date app all the time
const AutoImmediate: CodePushOptions = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

// for production environment, we want a more discreet update
// On each app start, we check for update, that we install on
// next app start. This means the app doesn't flicker and the update
// is not visible to the user.
const NextRestart: CodePushOptions = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

const config = env.ENV !== 'production' ? AutoImmediate : NextRestart

export const CodePushWrapper = ({ children }: { children: JSX.Element }) => {
  const synchronize = async () => {
    try {
      await CodePush.sync(config)
    } catch (_err) {
      // If we can't update the bundle, we don't want to crash the app
      // so we just catch the error and continue
    }
  }

  useEffect(() => {
    synchronize()
  }, [])

  return children
}
