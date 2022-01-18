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
import { useIsUserUnderage } from 'features/profile/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const Status = () => {
  const { activities } = useProfileOptions()
  const { dispatch, profile } = useIdentityCheckContext()
  const isUserUnderage = useIsUserUnderage()
  const [selectedStatus, setSelectedStatus] = useState<ActivityIdEnum | null>(
    profile.status || null
  )
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  // TODO PC-12410 : déléguer la responsabilité au back de faire cette filtration, remplacer filteredActivities par activities
  const filteredActivities = isUserUnderage
    ? activities
    : activities?.filter((activity) => activity.id !== ActivityIdEnum.MIDDLE_SCHOOL_STUDENT)

  // TODO PC-12410 : déléguer la responsabilité au back de vider l'array de school_types associé à l'activity (le statut)
  const hasSchoolTypes =
    isUserUnderage && !!filteredActivities && !!selectedStatus
      ? activityHasSchoolTypes(selectedStatus, filteredActivities)
      : false

  useEffect(() => {
    dispatch({ type: 'SET_HAS_SCHOOL_TYPES', payload: hasSchoolTypes })
  }, [hasSchoolTypes])

  const submitStatus = async () => {
    if (!selectedStatus) return
    await dispatch({ type: 'SET_STATUS', payload: selectedStatus })
    navigateToNextScreen()
  }

  useEnterKeyAction(selectedStatus ? submitStatus : undefined)

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
        <Form>
          {filteredActivities &&
            filteredActivities.map((activity) => (
              <RadioButton
                key={activity.label}
                selected={activity.id === selectedStatus}
                description={activity.description}
                name={activity.label}
                onPress={() => setSelectedStatus(activity.id)}
              />
            ))}
        </Form>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={submitStatus}
          title={!selectedStatus ? t`Choisis ton statut` : t`Continuer`}
          disabled={!selectedStatus}
        />
      }
    />
  )
}
