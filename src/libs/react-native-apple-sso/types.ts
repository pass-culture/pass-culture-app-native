import { RootStackParamList } from 'features/navigation/RootNavigator/types'

export type AppleLoginOptions = {
  onSuccess: ({ code, state }: { code: string; state: string }) => void
  onError?: (error: unknown) => void
}

export type AppleSSOContext = {
  type: 'login' | 'signup'
  params?: RootStackParamList['Login' | 'SignupForm']
}
