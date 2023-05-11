import { CommonActions, useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'

/**
 * At the end of an IdentityCheck flow, we navigate to the Stepper.
 * As the Stepper screen is already in the navigation stack, it navigates
 * backward (screen coming from left to right). However we'd like to navigate
 * forward (from right to left), to show a progression.
 * To do so, we reset the navigation stack, to include only the Home (default
 * screen of TabNavigator), and the Stepper. We set the index to 1, to show the Stepper.
 */
export const useNavigateForwardToStepper = () => {
  const { dispatch } = useNavigation<UseNavigationType>()

  const navigateForwardToStepper = () =>
    dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }],
      })
    )

  return { navigateForwardToStepper }
}
