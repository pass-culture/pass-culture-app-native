import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { ActivityIdEnum } from 'api/gen'
import { useActivityTypes } from 'features/identityCheck/api/useActivityTypes'
import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
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
  const { activities } = useActivityTypes()
  const { dispatch, profile } = useSubscriptionContext()
  const saveStep = useSaveStep()
  const { mutateAsync: patchProfile, isLoading } = usePatchProfile()
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

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      if (!formValues.selectedStatus) return
      // do not remove await statement here as we need to wait for status to be dispatched
      // in subscription context before posting profile to the api
      await dispatch({ type: 'SET_STATUS', payload: formValues.selectedStatus })
      analytics.logSetStatusClicked()

      await patchProfile()
      await saveStep(IdentityCheckStep.PROFILE)
      navigateForwardToStepper()
    },
    [dispatch, patchProfile, saveStep, navigateForwardToStepper]
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
                  {activities?.map((activity) => (
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
