import {
  CheatcodesStackParamList,
  CheatcodesStackRouteName,
} from 'features/navigation/navigators/CheatcodesStackNavigator/types'
import {
  RootScreenNames,
  RootStackParamList,
} from 'features/navigation/navigators/RootNavigator/types'
import {
  SubscriptionStackParamList,
  SubscriptionStackRouteName,
} from 'features/navigation/navigators/SubscriptionStackNavigator/types'
type NavigationTarget = {
  screen: CheatcodesStackRouteName
  params?: CheatcodesStackParamList[CheatcodesStackRouteName]
}

type SubScreenNavigationTarget = {
  screen: RootScreenNames | SubscriptionStackRouteName
  params?:
    | RootStackParamList[RootScreenNames]
    | SubscriptionStackParamList[SubscriptionStackRouteName]
}

type BaseCheatcodeButton = {
  id: string
  title: string
  showOnlyInSearch?: boolean
  disabled?: boolean
}

type NavigationButton = BaseCheatcodeButton & {
  navigationTarget: NavigationTarget
  onPress?: never
}

type SubScreenNavigationButton = BaseCheatcodeButton & {
  navigationTarget: SubScreenNavigationTarget
  onPress?: never
}

type ActionButton = BaseCheatcodeButton & {
  onPress: () => void
  navigationTarget?: never // Ensures we don't mix actions with navigation
}

type ContainerButton = BaseCheatcodeButton & {
  onPress?: never
  navigationTarget?: never
}

export type CheatcodeButton =
  | NavigationButton
  | ActionButton
  | ContainerButton
  | SubScreenNavigationButton

export type CheatcodeCategory = {
  id: string
  title: string
  subscreens: CheatcodeButton[]
} & ( // A category can also be a tappable button itself
  | { navigationTarget: NavigationTarget | SubScreenNavigationTarget; onPress?: never }
  | { onPress: () => void; navigationTarget?: never }
  | { onPress?: never; navigationTarget?: never }
)
