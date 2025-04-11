import { GenericRoute, TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'

export type OnboardingStackParamList = TutorialRootStackParamList

export type OnboardingStackRouteName = keyof OnboardingStackParamList

export type OnboardingStackRoute = GenericRoute<OnboardingStackParamList>
