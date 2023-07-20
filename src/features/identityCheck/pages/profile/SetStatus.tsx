import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { ActivityIdEnum } from 'api/gen'
import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { useProfileOptions } from 'features/identityCheck/api/useProfileOptions'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/helpers/schoolTypes'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer } from 'ui/theme'

type StatusForm = {
  selectedStatus: ActivityIdEnum | null
}

export const SetStatus = () => {
  const { activities } = useProfileOptions()
  const { dispatch, profile } = useSubscriptionContext()
  const isUserUnderage = useIsUserUnderage()
  const saveStep = useSaveStep()
  const { mutateAsync: patchProfile, isLoading } = usePatchProfile()
  const { navigate } = useNavigation<UseNavigationType>()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const titleID = uuidv4()
  const { control, handleSubmit, watch } = useForm<StatusForm>({
    mode: 'onChange',
    defaultValues: {
      selectedStatus: profile.status ?? null,
    },
  })

  useEffect(() => {
    analytics.logScreenViewSetStatus()
  }, [])

  const selectedStatus = watch('selectedStatus')

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

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      if (!formValues.selectedStatus) return
      dispatch({ type: 'SET_STATUS', payload: formValues.selectedStatus })
      analytics.logSetStatusClicked()

      if (hasSchoolTypes) {
        navigate('SetSchoolType')
      } else {
        await patchProfile()
        await saveStep(IdentityCheckStep.PROFILE)
        navigateForwardToStepper()
      }
    },
    [dispatch, hasSchoolTypes, navigate, patchProfile, saveStep, navigateForwardToStepper]
  )

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <Form.MaxWidth>
          <CenteredTitle titleID={titleID} title="Sélectionne ton statut" />
          <Spacer.Column numberOfSpaces={5} />
          <View accessibilityRole={AccessibilityRole.RADIOGROUP} accessibilityLabelledBy={titleID}>
            <Controller
              control={control}
              name="selectedStatus"
              render={({ field: { value, onChange } }) => (
                <VerticalUl>
                  {filteredActivities?.map((activity) => (
                    <Li key={activity.label}>
                      <RadioSelector
                        checked={activity.id === value}
                        label={activity.label}
                        description={activity.description}
                        onPress={() => onChange(activity.id)}
                      />
                      <Spacer.Column numberOfSpaces={3} />
                    </Li>
                  ))}
                </VerticalUl>
              )}
            />
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={handleSubmit(submitStatus)}
          wording={!selectedStatus ? 'Choisis ton statut' : 'Continuer'}
          accessibilityLabel={
            !selectedStatus ? 'Choisis ton statut' : 'Continuer vers l’étape suivante'
          }
          isLoading={isLoading}
          disabled={!selectedStatus}
        />
      }
    />
  )
}
