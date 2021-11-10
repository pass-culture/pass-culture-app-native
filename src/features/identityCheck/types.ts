import { IdentityCheckRootStackParamList } from 'features/navigation/RootNavigator'
import { IconInterface } from 'ui/svg/icons/types'

export type Step = 'profil' | 'identification' | 'confirmation' | 'end'

export type Screen = keyof IdentityCheckRootStackParamList

export interface StepConfig {
  name: Step
  // screenName: keyof IdentityCheckRootStackParamList
  label: string
  // path: string
  icon: React.FC<IconInterface>
  // screens: Array<Screen>
}
