import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import {
  getSchoolTypesIdsFromActivity,
  mapSchoolTypeIdToLabelAndDescription,
} from 'features/identityCheck/pages/profile/utils'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useProfileOptions } from 'features/identityCheck/utils/useProfileOptions'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export const SetSchoolType = () => {
  const { schoolTypes, activities } = useProfileOptions()

  const { dispatch, profile } = useIdentityCheckContext()
  const [selectedSchoolTypeId, setSelectedSchoolTypeId] = useState<SchoolTypesIdEnum | null>(
    profile.schoolType || null
  )
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const onPressContinue = async () => {
    if (!selectedSchoolTypeId) return
    await dispatch({ type: 'SET_SCHOOL_TYPE', payload: selectedSchoolTypeId })
    navigateToNextScreen()
  }

  const activitySchoolTypes = activities
    ? getSchoolTypesIdsFromActivity(profile.status as ActivityIdEnum, activities)
    : null

  const hasData = !!activitySchoolTypes && !!schoolTypes

  useEnterKeyAction(selectedSchoolTypeId ? onPressContinue : undefined)

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle title={t`Dans quel type d'établissement\u00a0?`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <VerticalUl>
            {hasData &&
              activitySchoolTypes.map((schoolTypeId) => {
                const { label, description } = mapSchoolTypeIdToLabelAndDescription(
                  schoolTypeId,
                  schoolTypes
                )
                return (
                  <Li key={schoolTypeId}>
                    <RadioButton
                      selected={schoolTypeId === selectedSchoolTypeId}
                      name={label as string}
                      description={description}
                      onPress={() => setSelectedSchoolTypeId(schoolTypeId)}
                    />
                  </Li>
                )
              })}
          </VerticalUl>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={onPressContinue}
          wording={!selectedSchoolTypeId ? t`Choisis ton statut` : t`Continuer`}
          accessibilityLabel={
            !selectedSchoolTypeId ? t`Choisis ton statut` : t`Continuer vers l'étape suivante`
          }
          disabled={!selectedSchoolTypeId}
        />
      }
    />
  )
}
