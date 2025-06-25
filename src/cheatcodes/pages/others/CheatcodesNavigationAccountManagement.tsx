import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const accountManagementCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Account Management ⚙️',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationAccountManagement' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Compte suspendu (fraude)',
      navigationTarget: { screen: 'FraudulentSuspendedAccount' },
    },
    {
      id: uuidv4(),
      title: 'Compte suspendu (demande)',
      navigationTarget: { screen: 'SuspendedAccountUponUserRequest' },
    },
    {
      id: uuidv4(),
      title: 'Compte réactivé avec succès',
      navigationTarget: { screen: 'AccountReactivationSuccess' },
    },
    {
      id: uuidv4(),
      title: 'Lien de réinitialisation expiré',
      navigationTarget: { screen: 'ResetPasswordExpiredLink' },
    },
    {
      id: uuidv4(),
      title: 'E-mail de réinitialisation envoyé',
      navigationTarget: {
        screen: 'ResetPasswordEmailSent',
        params: { email: 'jean.dupont@gmail.com' },
      },
    },
    {
      id: uuidv4(),
      title: 'Profile: Delete Reason',
      navigationTarget: getProfileNavConfig('DeleteProfileReason'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Debug Screen',
      navigationTarget: getProfileNavConfig('DebugScreen'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Confirm Delete',
      navigationTarget: getProfileNavConfig('ConfirmDeleteProfile'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Deactivate Success',
      navigationTarget: getProfileNavConfig('DeactivateProfileSuccess'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Delete Success',
      navigationTarget: getProfileNavConfig('DeleteProfileSuccess'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Delete Confirmation',
      navigationTarget: getProfileNavConfig('DeleteProfileConfirmation'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Account Not Deletable',
      navigationTarget: getProfileNavConfig('DeleteProfileAccountNotDeletable'),
    },
    {
      id: uuidv4(),
      title: 'Profile: Account Hacked',
      navigationTarget: getProfileNavConfig('DeleteProfileAccountHacked'),
    },
  ],
}

export const cheatcodesNavigationAccountManagementButtons: CheatcodeCategory[] = [
  accountManagementCheatcodeCategory,
]

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={accountManagementCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={accountManagementCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
