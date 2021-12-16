import { t } from '@lingui/macro'
import React, { useState, useEffect } from 'react'

import { ActivityIdEnum } from 'api/gen'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/utils'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useProfileOptions } from 'features/identityCheck/utils/useProfileOptions'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'

export const Status = () => {
  const { activities } = useProfileOptions()
  const { dispatch, profile } = useIdentityCheckContext()
  const [selectedStatus, setSelectedStatus] = useState<ActivityIdEnum | null>(
    profile.status || null
  )
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const hasSchoolTypes =
    activities && selectedStatus ? activityHasSchoolTypes(selectedStatus, activities) : false

  useEffect(() => {
    dispatch({ type: 'SET_HAS_SCHOOL_TYPES', payload: hasSchoolTypes })
  }, [hasSchoolTypes])

  const onPressContinue = async () => {
    if (!selectedStatus) return
    dispatch({ type: 'SET_STATUS', payload: selectedStatus })
    navigateToNextScreen()
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle title={t`Sélectionne ton statut`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <React.Fragment>
          {activities &&
            activities.map((activity) => (
              <RadioButton
                key={activity.label}
                selected={activity.id === selectedStatus}
                description={activity.description}
                name={activity.label}
                onPress={() => setSelectedStatus(activity.id)}
              />
            ))}
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={onPressContinue}
          title={!selectedStatus ? t`Choisis ton statut` : t`Continuer`}
          disabled={!selectedStatus}
        />
      }
    />
  )
}
