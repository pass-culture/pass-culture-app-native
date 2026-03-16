import { AppleLoginOptions } from 'libs/react-native-apple-sso/types'

// Apple Sign-In is not supported on web (will be implemented in a future story)
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const loginToApple = async (_options: AppleLoginOptions): Promise<void> => {}
