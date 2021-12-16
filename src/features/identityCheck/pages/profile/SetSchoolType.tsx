import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/native'

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
import { useProfileOptions } from 'features/identityCheck/utils/useProfileOptions'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'

export const SetSchoolType = () => {
  const { schoolTypes, activities } = useProfileOptions()

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

  const activitySchoolTypes = activities
    ? getSchoolTypesIdsFromActivity(profile.status as ActivityIdEnum, activities)
    : null

  const hasData = !!activitySchoolTypes && !!schoolTypes

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
        <Container>
          {hasData &&
            activitySchoolTypes.map((schoolTypeId) => {
              const schoolLabel = mapSchoolTypeIdToLabel(schoolTypeId, schoolTypes) as string
              return (
                <RadioButton
                  key={schoolTypeId}
                  selected={schoolTypeId === selectedSchoolTypeId}
                  name={schoolLabel}
                  onPress={() => setSelectedSchoolTypeId(schoolTypeId)}
                />
              )
            })}
        </Container>
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

const Container = styled.View({
  height: '100%',
})
