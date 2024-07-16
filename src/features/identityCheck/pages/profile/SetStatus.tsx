import colorAlpha from 'color-alpha'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { LayoutChangeEvent, View, ListRenderItem, FlatList, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'
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
import { useOnViewableItemsChanged } from 'features/subscription/helpers/useOnViewableItemsChanged'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { createAnimatableComponent, AnimatedViewRefType } from 'libs/react-native-animatable'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
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

const GRADIENT_HEIGHT = getSpacing(30)
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

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

  const gradientRef = useRef<AnimatedViewRefType>(null)

  const { onViewableItemsChanged } = useOnViewableItemsChanged(gradientRef, activities ?? [])

  const [bottomViewHeight, setBottomViewHeight] = useState(0)

  const headerHeight = useGetHeaderHeight()

  function onBottomViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomViewHeight(height)
  }

  const renderItem: ListRenderItem<ActivityResponseModel> = ({ item }) => (
    <View accessibilityRole={AccessibilityRole.RADIOGROUP} accessibilityLabelledBy={titleID}>
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
    </View>
  )

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Profil" />
      {activities ? (
        <FlatListContainer>
          <FlatList
            scrollIndicatorInsets={{ right: 1 }} // Corrects scrollbar in the middle
            contentContainerStyle={flatListStyles}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY_CONFIG}
            data={activities}
            keyExtractor={(item) => item.label}
            ListHeaderComponent={
              <React.Fragment>
                <View style={{ height: headerHeight }} />
                <CenteredTitle titleID={titleID} title="Sélectionne ton statut" />
                <Spacer.Column numberOfSpaces={5} />
              </React.Fragment>
            }
            renderItem={renderItem}
          />
        </FlatListContainer>
      ) : null}
      <Gradient ref={gradientRef} bottomViewHeight={bottomViewHeight} />
      <BottomView onLayout={onBottomViewLayout}>
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
      </BottomView>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const flatListStyles: ViewStyle = {
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignSelf: 'center',
}

const FlatListContainer = styled(View)({
  flex: 1,
})

const BottomView = styled(View)(({ theme }) => ({
  alignItems: 'center',
  paddingBottom: getSpacing(5),
  paddingTop: getSpacing(3),
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(5),
}))

const AnimatedGradient = createAnimatableComponent(LinearGradient)
const Gradient = styled(AnimatedGradient).attrs<{ bottomViewHeight: number }>(({ theme }) => ({
  colors: [colorAlpha(theme.colors.white, 0), theme.colors.white],
  locations: [0, 1],
  pointerEvents: 'none',
}))<{ bottomViewHeight: number }>(({ bottomViewHeight }) => ({
  position: 'absolute',
  height: GRADIENT_HEIGHT,
  left: 0,
  right: 0,
  bottom: bottomViewHeight,
}))
