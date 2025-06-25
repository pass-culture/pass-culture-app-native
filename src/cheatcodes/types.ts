import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'

/**
 * A dedicated object for all navigation-related data.
 */
type NavigationTarget = {
  screen: RootScreenNames
  params?: RootStackParamList[RootScreenNames]
}

/**
 * Base properties shared by all cheatcode buttons.
 * The `id` is crucial for React keys.
 */
type BaseCheatcodeButton = {
  id: string
  title: string
  showOnlyInSearch?: boolean
  disabled?: boolean
}

/**
 * A button that navigates to a screen.
 */
type NavigationButton = BaseCheatcodeButton & {
  navigationTarget: NavigationTarget
  onPress?: never // Ensures we don't mix navigation with custom actions
}

/**
 * A button that performs a custom action.
 */
type ActionButton = BaseCheatcodeButton & {
  onPress: () => void
  navigationTarget?: never // Ensures we don't mix actions with navigation
}

/**
 * A button that does nothing on its own but acts as a container.
 */
type ContainerButton = BaseCheatcodeButton & {
  onPress?: never
  navigationTarget?: never
}

// A CheatcodeButton is one of the three types above.
export type CheatcodeButton = NavigationButton | ActionButton | ContainerButton

/**
 * A category represents a top-level group in the cheatcodes menu,
 * containing a list of buttons or subscreens.
 */
export type CheatcodeCategory = {
  id: string
  title: string
  subscreens: CheatcodeButton[]
} & ( // A category can also be a tappable button itself
  | { navigationTarget: NavigationTarget; onPress?: never }
  | { onPress: () => void; navigationTarget?: never }
  | { onPress?: never; navigationTarget?: never }
)
