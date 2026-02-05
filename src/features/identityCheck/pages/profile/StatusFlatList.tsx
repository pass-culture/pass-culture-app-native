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
import { Li } from 'ui/components/Li'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { Spinner } from 'ui/components/Spinner'
import { Button } from 'ui/designSystem/Button/Button'
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
  isChangeStatus: boolean
  submitStatus: (formValues: StatusForm) => Promise<void>
  titleID: string
  control: Control<StatusForm>
  headerHeight: number
  formIsValid: boolean
}

export function StatusFlatList({
  handleSubmit,
  isLoading,
  isChangeStatus,
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
      <ControllerWrapper>
        <Controller
          control={control}
          name="selectedStatus"
          render={({ field: { value, onChange } }) => (
            <RadioSelector
              radioGroupLabel="Statut"
              label={item.label}
              checked={item.id === value}
              description={item.description}
              onPress={() => onChange(item.id)}
            />
          )}
        />
      </ControllerWrapper>
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
                <Container>
                  <Typo.Title3 {...getHeadingAttrs(2)}>Sélectionne ton statut</Typo.Title3>
                </Container>
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
        <Button
          type="submit"
          variant="primary"
          fullWidth
          onPress={handleSubmit(submitStatus)}
          wording={isChangeStatus ? 'Valider mes informations' : 'Continuer'}
          accessibilityLabel={
            isChangeStatus
              ? 'Valider mes informations et continuer'
              : 'Continuer vers l’étape suivante'
          }
          isLoading={isLoading}
          disabled={!formIsValid}
        />
        <Spacer.BottomScreen />
      </BottomView>
    </Page>
  )
}

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

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
  paddingBottom: theme.designSystem.size.spacing.xl,
  paddingTop: theme.designSystem.size.spacing.m,
  backgroundColor: theme.designSystem.color.background.default,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
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

const ControllerWrapper = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
}))
