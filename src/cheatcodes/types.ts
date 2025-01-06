import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'

export type ButtonProps = {
  title?: string
  screen?: RootScreenNames
  onPress?: () => void
  navigationParams?: RootStackParamList[RootScreenNames]
}

export type ButtonsWithSubscreensProps = Omit<ButtonProps, 'title'> & {
  title: string
  subscreens?: ButtonProps[]
}
