import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'

type CheatcodesButtonProps = {
  title?: string
  screen?: RootScreenNames
  onPress?: () => void
  navigationParams?: RootStackParamList[RootScreenNames]
}

export type CheatcodesButtonsWithSubscreensProps = Omit<CheatcodesButtonProps, 'title'> & {
  title: string
  subscreens?: CheatcodesButtonProps[]
}
