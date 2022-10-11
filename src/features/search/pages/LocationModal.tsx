import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { Slider } from 'ui/components/inputs/Slider'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export enum RadioButtonLocation {
  EVERYWHERE = 'Partout',
  AROUND_ME = 'Autour de moi',
  CHOOSE_PLACE_OR_VENUE = 'Choisir un lieu',
}

type LocationModalFormData = {
  locationChoice: RadioButtonLocation
  aroundRadius: number
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

const LOCATION_TYPES = [
  { label: RadioButtonLocation.EVERYWHERE, icon: Everywhere },
  { label: RadioButtonLocation.AROUND_ME, icon: AroundMe },
  { label: RadioButtonLocation.CHOOSE_PLACE_OR_VENUE, icon: LocationPointer },
]

const titleId = uuidv4()

export const LocationModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Location)
  const { navigate } = useNavigation<UseNavigationType>()
  const { isDesktopViewport, appContentWidth, slider, modal } = useTheme()
  const { searchState } = useSearch()
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    onPressGeolocPermissionModalButton,
  } = useGeolocation()

  const {
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
    visible: isGeolocPermissionModalVisible,
  } = useModal(false)
  const logChangeRadius = useLogFilterOnce(SectionTitle.Radius)

  const getLocationChoice = useCallback(() => {
    const locationType = searchState.locationFilter.locationType

    if (locationType === LocationType.EVERYWHERE) {
      return RadioButtonLocation.EVERYWHERE
    } else if (locationType === LocationType.AROUND_ME) {
      return RadioButtonLocation.AROUND_ME
    } else {
      return RadioButtonLocation.CHOOSE_PLACE_OR_VENUE
    }
  }, [searchState.locationFilter.locationType])

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isValid, isValidating },
    control,
    watch,
  } = useForm<LocationModalFormData>({
    mode: 'onChange',
    defaultValues: {
      locationChoice: getLocationChoice() || RadioButtonLocation.EVERYWHERE,
      aroundRadius:
        searchState.locationFilter.locationType === LocationType.AROUND_ME
          ? searchState.locationFilter.aroundRadius || MAX_RADIUS
          : MAX_RADIUS,
    },
  })

  const locationChoice = watch('locationChoice')

  const search = useCallback(
    (values: LocationModalFormData) => {
      let additionalSearchState: SearchState = searchState
      if (values.locationChoice === RadioButtonLocation.EVERYWHERE) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: { locationType: LocationType.EVERYWHERE },
        }
        analytics.logChangeSearchLocation({ type: 'everywhere' })
      }
      if (values.locationChoice === RadioButtonLocation.AROUND_ME) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: {
            locationType: LocationType.AROUND_ME,
            aroundRadius: getValues('aroundRadius'),
          },
        }
        analytics.logChangeSearchLocation({ type: 'aroundMe' })
      }

      navigate(
        ...getTabNavConfig('Search', {
          ...additionalSearchState,
          view: SearchView.Results,
        })
      )
      hideModal()
    },
    [getValues, hideModal, navigate, searchState]
  )

  const close = useCallback(() => {
    reset({
      locationChoice: getLocationChoice(),
      aroundRadius:
        searchState.locationFilter.locationType === LocationType.AROUND_ME
          ? searchState.locationFilter.aroundRadius || MAX_RADIUS
          : MAX_RADIUS,
    })
    hideModal()
  }, [reset, getLocationChoice, searchState.locationFilter, hideModal])

  const onSubmit = handleSubmit(search)

  const onResetPress = useCallback(() => {
    reset({
      locationChoice:
        position !== null ? RadioButtonLocation.AROUND_ME : RadioButtonLocation.EVERYWHERE,
      aroundRadius: MAX_RADIUS,
    })
  }, [position, reset])

  const onSelectLocation = useCallback(
    async (locationChoice: RadioButtonLocation) => {
      logUseFilter()
      if (locationChoice === RadioButtonLocation.AROUND_ME) {
        const grantedButUnknownPosition =
          position === null && permissionState === GeolocPermissionState.GRANTED
        if (grantedButUnknownPosition) {
          return
        }
        if (position === null) {
          if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
            showGeolocPermissionModal()
            return
          } else {
            await requestGeolocPermission()
          }
        }
      }

      setValue('locationChoice', locationChoice)
    },
    [
      logUseFilter,
      setValue,
      position,
      permissionState,
      showGeolocPermissionModal,
      requestGeolocPermission,
    ]
  )

  const disabled = !isValid || (!isValidating && isSubmitting)

  const baseSliderContainerWidth = isDesktopViewport ? modal.desktopMaxWidth : appContentWidth

  const sliderLength = baseSliderContainerWidth - modal.spacing.MD * 2 - slider.markerSize

  const hasAroundMeRadius = useMemo(() => {
    return locationChoice === RadioButtonLocation.AROUND_ME
  }, [locationChoice])

  const onValuesChangeFinish = useCallback(
    (newValues: number[]) => {
      setValue('aroundRadius', newValues[0])
      logChangeRadius()
    },
    [logChangeRadius, setValue]
  )

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={close} />
        )
      }
      title={title}
      isFullscreen={true}
      noPadding={true}
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={close}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={disabled}
        />
      }
      scrollEnabled={locationChoice !== RadioButtonLocation.AROUND_ME}>
      <Form.MaxWidth>
        <Controller
          control={control}
          name="locationChoice"
          render={({ field: { value } }) => (
            <React.Fragment>
              {LOCATION_TYPES.map((item, index) => (
                <View key={item.label}>
                  <Spacer.Column numberOfSpaces={6} />
                  <RadioButton
                    onSelect={() => onSelectLocation(item.label)}
                    isSelected={value === item.label}
                    testID={item.label}
                    {...item}
                  />
                  {item.label === RadioButtonLocation.AROUND_ME && (
                    <Controller
                      control={control}
                      name="aroundRadius"
                      render={({ field: { value } }) => (
                        <React.Fragment>
                          {!!hasAroundMeRadius && (
                            <View>
                              <Spacer.Column numberOfSpaces={4} />
                              <LabelRadiusContainer>
                                <Typo.Body>{`Dans un rayon de\u00a0:`}</Typo.Body>
                                <Typo.ButtonText>{`${value}\u00a0km`}</Typo.ButtonText>
                              </LabelRadiusContainer>
                              <Spacer.Column numberOfSpaces={2} />
                              <Slider
                                showValues={false}
                                values={[value]}
                                max={MAX_RADIUS}
                                onValuesChangeFinish={onValuesChangeFinish}
                                shouldShowMinMaxValues={true}
                                sliderLength={sliderLength}
                              />
                            </View>
                          )}
                        </React.Fragment>
                      )}
                    />
                  )}
                  <Spacer.Column numberOfSpaces={6} />
                  {index + 1 < LOCATION_TYPES.length && <Separator />}
                </View>
              ))}
              <InputError
                visible={!!positionError}
                messageId={positionError?.message}
                numberOfSpacesTop={1}
              />
              <GeolocationActivationModal
                isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
                hideGeolocPermissionModal={hideGeolocPermissionModal}
                onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
              />
            </React.Fragment>
          )}
        />
      </Form.MaxWidth>
    </AppModal>
  )
}

const LabelRadiusContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})
