import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { useProfileOptions } from 'features/identityCheck/api/useProfileOptions'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import {
  getSchoolTypesIdsFromActivity,
  mapSchoolTypeIdToLabelAndDescription,
} from 'features/identityCheck/pages/profile/helpers/schoolTypes'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { RadioSelector, RadioSelectorType } from 'ui/components/radioSelector/RadioSelector'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer } from 'ui/theme'

export const SetSchoolType = () => {
  const { schoolTypes, activities } = useProfileOptions()
  const saveStep = useSaveStep()
  const { mutateAsync: patchProfile, isLoading } = usePatchProfile()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()

  const { dispatch, profile } = useSubscriptionContext()
  const [selectedSchoolTypeId, setSelectedSchoolTypeId] = useState<SchoolTypesIdEnum | null>(
    profile.schoolType ?? null
  )

  useEffect(() => {
    analytics.logScreenViewSetSchoolType()
  }, [])

  const onPressContinue = async () => {
    if (!selectedSchoolTypeId) return
    await dispatch({ type: 'SET_SCHOOL_TYPE', payload: selectedSchoolTypeId })
    analytics.logSetSchoolTypeClicked()

    await patchProfile()
    await saveStep(IdentityCheckStep.PROFILE)
    navigateForwardToStepper()
  }

  const activitySchoolTypes = activities
    ? getSchoolTypesIdsFromActivity(profile.status as ActivityIdEnum, activities)
    : null

  const hasData = !!activitySchoolTypes && !!schoolTypes

  const titleID = uuidv4()

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <Form.MaxWidth>
          <CenteredTitle titleID={titleID} title="Dans quel type d’établissement&nbsp;?" />
          <Spacer.Column numberOfSpaces={5} />
          <View accessibilityRole={AccessibilityRole.RADIOGROUP} accessibilityLabelledBy={titleID}>
            <VerticalUl>
              {hasData &&
                activitySchoolTypes.map((schoolTypeId) => {
                  const { label, description } = mapSchoolTypeIdToLabelAndDescription(
                    schoolTypeId,
                    schoolTypes
                  )
                  return (
                    <Li key={schoolTypeId}>
                      <RadioSelector
                        type={
                          schoolTypeId === selectedSchoolTypeId
                            ? RadioSelectorType.ACTIVE
                            : RadioSelectorType.DEFAULT
                        }
                        label={label as string}
                        description={description}
                        onPress={() => setSelectedSchoolTypeId(schoolTypeId)}
                      />
                      <Spacer.Column numberOfSpaces={3} />
                    </Li>
                  )
                })}
            </VerticalUl>
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={onPressContinue}
          wording={!selectedSchoolTypeId ? 'Choisis ton statut' : 'Continuer'}
          accessibilityLabel={
            !selectedSchoolTypeId ? 'Choisis ton statut' : 'Continuer vers l’étape suivante'
          }
          isLoading={isLoading}
          disabled={!selectedSchoolTypeId}
        />
      }
    />
  )
}
