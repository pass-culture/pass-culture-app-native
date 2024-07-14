import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { LayoutChangeEvent, View, ListRenderItem, FlatList } from 'react-native'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { ActivityIdEnum, ActivityResponseModel } from 'api/gen'
import { useActivityTypes } from 'features/identityCheck/api/useActivityTypes'
import { usePatchProfile } from 'features/identityCheck/api/usePatchProfile'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Li } from 'ui/components/Li'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { getSpacing, Spacer } from 'ui/theme'

type StatusForm = {
  selectedStatus: ActivityIdEnum | null
}

export const SetStatus = () => {
  const { activities } = useActivityTypes()
  const saveStep = useSaveStep()
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()

  const { mutateAsync: patchProfile, isLoading } = usePatchProfile()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const titleID = uuidv4()
  const { control, handleSubmit, watch } = useForm<StatusForm>({
    mode: 'onChange',
    defaultValues: {
      selectedStatus: null,
    },
  })

  useEffect(() => {
    analytics.logScreenViewSetStatus()
  }, [])

  const selectedStatus = watch('selectedStatus')

  const submitStatus = useCallback(
    async (formValues: StatusForm) => {
      if (!formValues.selectedStatus) return
      analytics.logSetStatusClicked()

      const profile = {
        name: storedName,
        city: storedCity,
        address: storedAddress,
        status: formValues.selectedStatus,
        hasSchoolTypes: false,
        schoolType: null,
      }
      await patchProfile(profile)
      await saveStep(IdentityCheckStep.PROFILE)
      navigateForwardToStepper()
    },
    [storedName, storedCity, storedAddress, patchProfile, saveStep, navigateForwardToStepper]
  )

  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  const headerHeight = useGetHeaderHeight()

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  const renderItem: ListRenderItem<ActivityResponseModel> = ({ item }) => (
    <Li key={item.label}>
      <Controller
        control={control}
        name="selectedStatus"
        render={({ field: { value, onChange } }) => (
          <RadioSelector
            checked={item.id === value}
            label={item.label}
            description={item.description}
            onPress={() => onChange(item.id)}
          />
        )}
      />
      <Spacer.Column numberOfSpaces={3} />
    </Li>
  )
  const flatListContainer = {
    flexGrow: 1,
    paddingBottom: bottomChildrenViewHeight,
    paddingHorizontal: getSpacing(5),
  }

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Profil" />
      <FlatList
        contentContainerStyle={flatListContainer}
        data={activities}
        keyExtractor={(item) => item.label}
        ListHeaderComponent={
          <React.Fragment>
            <View style={{ height: headerHeight }} />
            <Form.MaxWidth>
              <CenteredTitle titleID={titleID} title="Sélectionne ton statut" />
              <Spacer.Column numberOfSpaces={5} />
            </Form.MaxWidth>
          </React.Fragment>
        }
        renderItem={renderItem}
      />
      <FixedBottomView onLayout={onFixedBottomChildrenViewLayout}>
        <ButtonPrimary
          type="submit"
          onPress={handleSubmit(submitStatus)}
          wording={selectedStatus ? 'Continuer' : 'Choisis ton statut'}
          accessibilityLabel={
            selectedStatus ? 'Continuer vers l’étape suivante' : 'Choisis ton statut'
          }
          isLoading={isLoading}
          disabled={!selectedStatus}
        />
        <Spacer.BottomScreen />
      </FixedBottomView>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const FixedBottomView = styled(View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: getSpacing(5),
  paddingTop: getSpacing(3),
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(5),
}))
