import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { ActivityIdEnum, SchoolTypesIdEnum } from 'api/gen'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { RadioButton } from 'features/identityCheck/atoms/form/RadioButton'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import {
  getSchoolTypesIdsFromActivity,
  mapSchoolTypeIdToLabel,
} from 'features/identityCheck/pages/profile/utils'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useSchoolTypes } from 'features/identityCheck/utils/useSchoolTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'

export const SetSchoolType = () => {
  const { schoolTypes, activities } = useSchoolTypes()

  const { dispatch, profile } = useIdentityCheckContext()
  const [selectedSchoolTypeId, setSelectedSchoolTypeId] = useState<SchoolTypesIdEnum | null>(
    profile.schoolType || null
  )
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const onPressContinue = () => {
    if (!selectedSchoolTypeId) return
    dispatch({ type: 'SET_SCHOOL_TYPE', payload: selectedSchoolTypeId })
    navigateToNextScreen()
  }

  // TODO PC-11901 : l'activité doit se baser le status de profile tiré de identityCheckContext
  // En dur pour le test sur les cheatcodes.
  const schoolTypesIds = activities
    ? getSchoolTypesIdsFromActivity(ActivityIdEnum.HIGHSCHOOLSTUDENT, activities)
    : null

  const hasData = !!schoolTypesIds && !!schoolTypes

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle title={t`Dans quel type d'établissement ?`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <React.Fragment>
          {hasData &&
            schoolTypesIds.map((schoolTypeId) => {
              const schoolLabel = mapSchoolTypeIdToLabel(schoolTypeId, schoolTypes) as string
              return (
                <RadioButton
                  key={schoolLabel}
                  selected={schoolTypeId === selectedSchoolTypeId}
                  name={schoolLabel}
                  onPress={() => setSelectedSchoolTypeId(schoolTypeId)}
                />
              )
            })}
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={onPressContinue}
          title={!selectedSchoolTypeId ? t`Choisis ton statut` : t`Continuer`}
          disabled={!selectedSchoolTypeId}
        />
      }
    />
  )
}
