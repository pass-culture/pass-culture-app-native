import { t } from '@lingui/macro'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { ActivityIdEnum } from 'api/gen'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/utils'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useProfileOptions } from 'features/identityCheck/utils/useProfileOptions'
import { useIsUserUnderage } from 'features/profile/utils'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { RadioButtonWithBorder } from 'ui/components/radioButtons/RadioButtonWithBorder'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export const SetStatus = () => {
  const { activities } = useProfileOptions()
  const { dispatch, profile } = useIdentityCheckContext()
  const isUserUnderage = useIsUserUnderage()
  const [selectedStatus, setSelectedStatus] = useState<ActivityIdEnum | null>(
    profile.status || null
  )
  const { navigateToNextScreen, isSavingCheckpoint } = useIdentityCheckNavigation()
  const titleID = uuidv4()

  // TODO(PC-12410): déléguer la responsabilité au back de faire cette filtration, remplacer filteredActivities par activities
  const filteredActivities = isUserUnderage
    ? activities
    : activities?.filter((activity) => activity.id !== ActivityIdEnum.MIDDLE_SCHOOL_STUDENT)

  // TODO(PC-12410): déléguer la responsabilité au back de vider l'array de school_types associé à l'activity (le statut)
  const hasSchoolTypes =
    isUserUnderage && !!filteredActivities && !!selectedStatus
      ? activityHasSchoolTypes(selectedStatus, filteredActivities)
      : false

  useEffect(() => {
    dispatch({ type: 'SET_HAS_SCHOOL_TYPES', payload: hasSchoolTypes })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSchoolTypes])

  const submitStatus = async () => {
    if (!selectedStatus) return
    await dispatch({ type: 'SET_STATUS', payload: selectedStatus })
    navigateToNextScreen()
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title={t`Sélectionne ton statut`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View accessibilityRole={AccessibilityRole.RADIOGROUP} aria-labelledby={titleID}>
            <VerticalUl>
              {filteredActivities &&
                filteredActivities.map((activity) => (
                  <Li key={activity.label}>
                    <RadioButtonWithBorder
                      selected={activity.id === selectedStatus}
                      description={activity.description}
                      label={activity.label}
                      onPress={() => setSelectedStatus(activity.id)}
                    />
                  </Li>
                ))}
            </VerticalUl>
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={submitStatus}
          wording={!selectedStatus ? t`Choisis ton statut` : t`Continuer`}
          accessibilityLabel={
            !selectedStatus ? t`Choisis ton statut` : t`Continuer vers l'étape suivante`
          }
          isLoading={isSavingCheckpoint}
          disabled={!selectedStatus}
        />
      }
    />
  )
}
