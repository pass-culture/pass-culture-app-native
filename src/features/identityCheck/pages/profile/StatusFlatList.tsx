import colorAlpha from 'color-alpha'
import React, { useRef, useState } from 'react'
import { Control, Controller, UseFormHandleSubmit } from 'react-hook-form'
import { View, FlatList, ViewStyle, LayoutChangeEvent, ListRenderItem } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { ActivityIdEnum, ActivityResponseModel } from 'api/gen'
import { useActivityTypes } from 'features/identityCheck/api/useActivityTypes'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { useOnViewableItemsChanged } from 'features/subscription/helpers/useOnViewableItemsChanged'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AnimatedViewRefType, createAnimatableComponent } from 'libs/react-native-animatable'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Li } from 'ui/components/Li'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { getSpacing, Spacer } from 'ui/theme'

const GRADIENT_HEIGHT = getSpacing(30)
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

export type StatusForm = {
  selectedStatus: ActivityIdEnum | null
}

interface Props {
  handleSubmit: UseFormHandleSubmit<StatusForm>
  isLoading: boolean
  selectedStatus: ActivityIdEnum | null
  submitStatus: (formValues: StatusForm) => Promise<void>
  titleID: string
  control: Control<StatusForm>
  headerHeight: number
}

export function StatusFlatList({
  handleSubmit,
  isLoading,
  selectedStatus,
  submitStatus,
  titleID,
  control,
  headerHeight,
}: Props) {
  const { activities } = useActivityTypes()

  const gradientRef = useRef<AnimatedViewRefType>(null)

  const { onViewableItemsChanged } = useOnViewableItemsChanged(gradientRef, activities ?? [])

  const [bottomViewHeight, setBottomViewHeight] = useState(0)

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
          wording={selectedStatus ? 'Continuer' : 'Valider mon statut'}
          accessibilityLabel={
            selectedStatus ? 'Continuer vers l’étape suivante' : 'Valider mon statut'
          }
          isLoading={isLoading}
          disabled={!selectedStatus}
        />
        <Spacer.BottomScreen />
      </BottomView>
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
