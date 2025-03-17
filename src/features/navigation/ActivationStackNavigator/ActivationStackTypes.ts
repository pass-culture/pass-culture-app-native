import { GenericRoute, TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'

export type ActivationStackParamList = TutorialRootStackParamList

export type ActivationStackRouteName = keyof ActivationStackParamList

export type ActivationStackRoute = GenericRoute<ActivationStackParamList>
