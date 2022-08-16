import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { useProfileOptions } from 'features/identityCheck/api/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import {
  getSchoolTypesIdsFromActivity,
  mapSchoolTypeIdToLabelAndDescription,
} from 'features/identityCheck/pages/profile/utils'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Li } from 'ui/components/Li'
import { RadioButtonWithBorder } from 'ui/components/radioButtons/RadioButtonWithBorder'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const SetSchoolType = () => {
  const { schoolTypes, activities } = useProfileOptions()

  const { dispatch, profile } = useIdentityCheckContext()
  const [selectedSchoolTypeId, setSelectedSchoolTypeId] = useState<SchoolTypesIdEnum | null>(
    profile.schoolType || null
  )
  const { navigateToNextScreen, isSavingCheckpoint } = useIdentityCheckNavigation()

  const onPressContinue = async () => {
    if (!selectedSchoolTypeId) return
    await dispatch({ type: 'SET_SCHOOL_TYPE', payload: selectedSchoolTypeId })
    navigateToNextScreen()
  }

  const activitySchoolTypes = activities
    ? getSchoolTypesIdsFromActivity(profile.status as ActivityIdEnum, activities)
    : null

  const hasData = !!activitySchoolTypes && !!schoolTypes

  const titleID = uuidv4()

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title={t`Dans quel type d'établissement\u00a0?`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View accessibilityRole={AccessibilityRole.RADIOGROUP} aria-labelledby={titleID}>
            <VerticalUl>
              {hasData &&
                activitySchoolTypes.map((schoolTypeId) => {
                  const { label, description } = mapSchoolTypeIdToLabelAndDescription(
                    schoolTypeId,
                    schoolTypes
                  )
                  return (
                    <Li key={schoolTypeId}>
                      <RadioButtonWithBorder
                        selected={schoolTypeId === selectedSchoolTypeId}
                        label={label as string}
                        description={description}
                        onPress={() => setSelectedSchoolTypeId(schoolTypeId)}
                      />
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
          wording={!selectedSchoolTypeId ? t`Choisis ton statut` : t`Continuer`}
          accessibilityLabel={
            !selectedSchoolTypeId ? t`Choisis ton statut` : t`Continuer vers l'étape suivante`
          }
          isLoading={isSavingCheckpoint}
          disabled={!selectedSchoolTypeId}
        />
      }
    />
  )
}
