import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'

export type CheatcodesButtonProps = {
  title?: string
  screen?: RootScreenNames
  onPress?: () => void
  navigationParams?: RootStackParamList[RootScreenNames]
  showOnlyInSearch?: boolean
}

export type CheatcodesButtonsWithSubscreensProps = Omit<
  CheatcodesButtonProps,
  'title' | 'showOnlyInSearch'
> & {
  title: string
  subscreens: CheatcodesButtonProps[]
}
