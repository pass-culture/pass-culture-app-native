// cheatcodes/pages/others/CheatcodesNavigationAccountManagement.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { useGoBack } from 'features/navigation/useGoBack'

// --- We define a single, well-typed category object ---
export const accountManagementCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Account Management ⚙️',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationAccountManagement' },
  },
  subscreens: [
    // Direct navigation targets with explicit titles
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
    // Using getProfileNavConfig with hardcoded titles
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

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationAccountManagementButtons: CheatcodeCategory[] = [
  accountManagementCheatcodeCategory,
]

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    // The title is from our clean object, and we pass the goBack handler
    <CheatcodesTemplateScreen title={accountManagementCheatcodeCategory.title} onGoBack={goBack}>
      {/* We pass the clean subscreens array directly. */}
      <CheatcodesSubscreensButtonList buttons={accountManagementCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
