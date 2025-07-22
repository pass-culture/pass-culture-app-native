import colorAlpha from 'color-alpha'
import React, { useRef, useState } from 'react'
import { Control, Controller, UseFormHandleSubmit } from 'react-hook-form'
import { View, FlatList, ViewStyle, LayoutChangeEvent, ListRenderItem } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { ActivityIdEnum, ActivityResponseModel } from 'api/gen'
import { useActivityTypes } from 'features/identityCheck/queries/useActivityTypesQuery'
import { useOnViewableItemsChanged } from 'features/subscription/helpers/useOnViewableItemsChanged'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AnimatedViewRefType, createAnimatableComponent } from 'libs/react-native-animatable'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Li } from 'ui/components/Li'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { Spinner } from 'ui/components/Spinner'
import { Page } from 'ui/pages/Page'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const GRADIENT_HEIGHT = getSpacing(30)
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

export type StatusForm = {
  selectedStatus: ActivityIdEnum
}

interface Props {
  handleSubmit: UseFormHandleSubmit<StatusForm>
  isLoading: boolean
  selectedStatus: ActivityIdEnum | null
  submitStatus: (formValues: StatusForm) => Promise<void>
  titleID: string
  control: Control<StatusForm>
  headerHeight: number
  formIsValid: boolean
}

export function StatusFlatList({
  handleSubmit,
  isLoading,
  selectedStatus,
  submitStatus,
  titleID,
  control,
  headerHeight,
  formIsValid,
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
    <Li
      key={item.label}
      accessibilityRole={AccessibilityRole.RADIOGROUP}
      accessibilityLabelledBy={titleID}>
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

  return (
    <Page>
      {activities ? (
        <FlatListContainer>
          <FlatList
            listAs="ul"
            scrollIndicatorInsets={{ right: 1 }} // Corrects scrollbar in the middle
            contentContainerStyle={flatListStyles}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY_CONFIG}
            data={activities}
            keyExtractor={(item) => item.label}
            ListHeaderComponent={
              <React.Fragment>
                <HeaderHeightSpacer headerHeight={headerHeight} />
                <Spacer.Column numberOfSpaces={2} />
                <Typo.Title3 {...getHeadingAttrs(2)}>Sélectionne ton statut</Typo.Title3>
                <Spacer.Column numberOfSpaces={8} />
              </React.Fragment>
            }
            renderItem={renderItem}
          />
        </FlatListContainer>
      ) : (
        <SpinnerView headerHeight={headerHeight}>
          <Spinner testID="spinner" />
        </SpinnerView>
      )}
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
          disabled={!formIsValid}
        />
        <Spacer.BottomScreen />
      </BottomView>
    </Page>
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
  backgroundColor: theme.designSystem.color.background.default,
  paddingHorizontal: getSpacing(5),
}))

const HeaderHeightSpacer = styled(View).attrs<{ headerHeight: number }>({})<{
  headerHeight: number
}>(({ headerHeight }) => ({
  paddingTop: headerHeight,
}))

const SpinnerView = styled(View).attrs<{ headerHeight: number }>({})<{
  headerHeight: number
}>(({ headerHeight }) => ({
  flex: 1,
  paddingTop: headerHeight,
  justifyContent: 'center',
}))

const AnimatedGradient = createAnimatableComponent(LinearGradient)
const Gradient = styled(AnimatedGradient).attrs<{ colors?: string[]; bottomViewHeight: number }>(
  ({ theme }) => ({
    colors: [
      colorAlpha(theme.designSystem.color.background.default, 0),
      theme.designSystem.color.background.default,
    ],
    locations: [0, 1],
    pointerEvents: 'none',
  })
)<{ bottomViewHeight: number }>(({ bottomViewHeight }) => ({
  position: 'absolute',
  height: GRADIENT_HEIGHT,
  left: 0,
  right: 0,
  bottom: bottomViewHeight,
}))
