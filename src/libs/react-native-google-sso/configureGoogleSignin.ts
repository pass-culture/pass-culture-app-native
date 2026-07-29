// eslint-disable-next-line no-restricted-imports
import { GoogleSignin, type ConfigureParams } from '@react-native-google-signin/google-signin'

export const configureGoogleSignin = (options?: ConfigureParams) => {
  GoogleSignin.configure(options)
}
