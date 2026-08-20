import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import {
  BaseLeaveProfileReason,
  ReasonButton,
} from 'features/profile/pages/SuspendProfileReason/BaseLeaveProfileReason'
import { isCurrentBeneficiary } from 'shared/user/checkStatusType'
import { getAge } from 'shared/user/getAge'

const deleteReasonButtons = (canDelete: boolean): ReasonButton[] => [
  {
    wording: 'J’aimerais créer un compte avec une adresse e-mail différente',
    navigateTo: { ...getProfilePropConfig('ChangeEmail', { showModal: true }) },
    analyticsReason: 'changeEmail',
  },
  {
    wording: 'Je n’utilise plus l’application',
    navigateTo: {
      ...getProfilePropConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'noLongerUsed',
  },
  {
    wording: 'Je n’ai plus de crédit ou très peu de crédit restant',
    navigateTo: {
      ...getProfilePropConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'noMoreCredit',
  },
  {
    wording: 'Je souhaite supprimer mes données personnelles',
    navigateTo: {
      ...getProfilePropConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'dataDeletion',
  },
  {
    wording: 'Autre',
    navigateTo: {
      ...getProfilePropConfig('DeleteProfileContactSupport'),
    },
    analyticsReason: 'other',
  },
]

export const DeleteProfileReason = () => {
  const { user } = useAuthContext()
  const userIsDefinedAndAbove21 = user?.birthDate && getAge(user?.birthDate) >= 21
  const canDeleteProfile = (!!user && !isCurrentBeneficiary(user)) || userIsDefinedAndAbove21
  const reasons = deleteReasonButtons(!!canDeleteProfile)

  return (
    <BaseLeaveProfileReason
      pageTitle="Suppression de compte"
      title="Pourquoi souhaites-tu supprimer ton compte&nbsp;?"
      subtitle="Triste de te voir partir&nbsp;! Dis-nous pourquoi pour nous aider à améliorer l’application."
      reasonsButtons={reasons}
    />
  )
}
