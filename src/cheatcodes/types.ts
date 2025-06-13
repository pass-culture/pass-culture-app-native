import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'

type CheatcodesButtonProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
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
