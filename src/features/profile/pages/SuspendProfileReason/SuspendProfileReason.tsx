import React from 'react'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import {
  BaseLeaveProfileReason,
  ReasonButton,
} from 'features/profile/pages/SuspendProfileReason/BaseLeaveProfileReason'

const suspendReasonButtons = (): ReasonButton[] => [
  {
    wording: 'Je pense que quelqu’un d’autre a accès à mon compte',
    navigateTo: {
      ...getProfilePropConfig('SuspendProfileAccountHacked'),
    },
    analyticsReason: 'hackedAccount',
  },
  {
    wording: 'Autre',
    navigateTo: {
      ...getProfilePropConfig('DeleteProfileContactSupport'),
    },
    analyticsReason: 'other',
  },
]

export const SuspendProfileReason = () => {
  return (
    <BaseLeaveProfileReason
      pageTitle="Suspension de compte"
      title="Pourquoi souhaites-tu suspendre ton compte&nbsp;?"
      subtitle="Tu mets ton compte en pause&nbsp;? Dis-nous pourquoi pour nous aider à améliorer l’application."
      reasonsButtons={suspendReasonButtons()}
    />
  )
}
