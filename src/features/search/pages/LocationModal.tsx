import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react'
import { Controller, SetValueConfig, useForm } from 'react-hook-form'
import { Keyboard, View, TextInput as RNTextInput } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { locationSchema } from 'features/search/pages/schema/locationSchema'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlaces'
import { useSetFocusWithCondition } from 'features/search/pages/useSetFocusWithCondition'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { SuggestedPlace } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'
import { Form } from 'ui/components/Form'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Slider } from 'ui/components/inputs/Slider'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { useDebounce } from 'ui/hooks/useDebounce'
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
  selectedPlaceOrVenue?: SuggestedVenue | SuggestedPlace
  searchPlaceOrVenue: string
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

const LOCATION_TYPES = [
  { label: RadioButtonLocation.CHOOSE_PLACE_OR_VENUE, icon: LocationPointer },
  { label: RadioButtonLocation.AROUND_ME, icon: AroundMe },
  { label: RadioButtonLocation.EVERYWHERE, icon: Everywhere },
]

const titleId = uuidv4()
const accessibilityDescribedBy = uuidv4()

const getLocationChoice = (locationType: LocationType) => {
  if (locationType === LocationType.EVERYWHERE) {
    return RadioButtonLocation.EVERYWHERE
  } else if (locationType === LocationType.AROUND_ME) {
    return RadioButtonLocation.AROUND_ME
  } else {
    return RadioButtonLocation.CHOOSE_PLACE_OR_VENUE
  }
}

export const LocationModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const logUseFilter = useLogFilterOnce(SectionTitle.Location)
  const { navigate } = useNavigation<UseNavigationType>()
  const { isDesktopViewport, appContentWidth, forms, slider, modal } = useTheme()
  const { searchState } = useSearch()
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    onPressGeolocPermissionModalButton: onPressGeolocPermissionModalButtonDefault,
  } = useGeolocation()
  const searchPlaceOrVenueInputRef = useRef<RNTextInput | null>(null)

  const {
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
    visible: isGeolocPermissionModalVisible,
  } = useModal(false)

  const onPressGeolocPermissionModalButton = useCallback(() => {
    hideGeolocPermissionModal()
    onPressGeolocPermissionModalButtonDefault()
  }, [hideGeolocPermissionModal, onPressGeolocPermissionModalButtonDefault])

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)

  const logChangeRadius = useLogFilterOnce(SectionTitle.Radius)

  const defaultValues = useMemo(() => {
    return {
      locationChoice: getLocationChoice(searchState.locationFilter.locationType),
      aroundRadius:
        searchState.locationFilter.locationType === LocationType.AROUND_ME
          ? searchState.locationFilter.aroundRadius || MAX_RADIUS
          : MAX_RADIUS,
      searchPlaceOrVenue:
        searchState.locationFilter.locationType === LocationType.VENUE
          ? searchState.locationFilter.venue.label
          : searchState.locationFilter.locationType === LocationType.PLACE
          ? searchState.locationFilter.place.label
          : '',
      selectedPlaceOrVenue:
        searchState.locationFilter.locationType === LocationType.VENUE
          ? searchState.locationFilter.venue
          : searchState.locationFilter.locationType === LocationType.PLACE
          ? searchState.locationFilter.place
          : undefined,
    }
  }, [searchState.locationFilter])

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
    resolver: yupResolver(locationSchema),
    defaultValues,
  })
  const { dispatch: dispatchStagedSearch } = useStagedSearch()

  const watchedSearchPlaceOrVenue = watch('searchPlaceOrVenue')
  const debouncedSearchPlaceOrVenue = useDebounce(watchedSearchPlaceOrVenue, 500)
  const watchedLocationChoice = watch('locationChoice')
  useSetFocusWithCondition(
    watchedLocationChoice === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE,
    searchPlaceOrVenueInputRef
  )

  const search = useCallback(
    ({ locationChoice, selectedPlaceOrVenue, aroundRadius }: LocationModalFormData) => {
      let additionalSearchState: SearchState = { ...searchState }
      if (locationChoice === RadioButtonLocation.EVERYWHERE) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: { locationType: LocationType.EVERYWHERE },
        }
        dispatchStagedSearch({ type: 'SET_LOCATION_EVERYWHERE' })
        analytics.logChangeSearchLocation({ type: 'everywhere' })
      } else if (locationChoice === RadioButtonLocation.AROUND_ME) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: {
            locationType: LocationType.AROUND_ME,
            aroundRadius: getValues('aroundRadius'),
          },
        }
        dispatchStagedSearch({ type: 'SET_LOCATION_AROUND_ME' })
        analytics.logChangeSearchLocation({ type: 'aroundMe' })
      } else if (locationChoice === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE) {
        const locationType = Object.prototype.hasOwnProperty.call(
          selectedPlaceOrVenue,
          'geolocation'
        )
          ? LocationType.PLACE
          : LocationType.VENUE

        if (locationType === LocationType.PLACE) {
          additionalSearchState = {
            ...additionalSearchState,
            locationFilter: {
              locationType: LocationType.PLACE,
              place: selectedPlaceOrVenue as SuggestedPlace,
              aroundRadius,
            },
          }
          dispatchStagedSearch({
            type: 'SET_LOCATION_PLACE',
            payload: { aroundRadius, place: selectedPlaceOrVenue as SuggestedPlace },
          })
          analytics.logChangeSearchLocation({ type: 'place' })
        } else {
          additionalSearchState = {
            ...additionalSearchState,
            locationFilter: {
              locationType: LocationType.VENUE,
              venue: selectedPlaceOrVenue as SuggestedVenue,
            },
          }
          dispatchStagedSearch({
            type: 'SET_LOCATION_VENUE',
            payload: { ...(selectedPlaceOrVenue as SuggestedVenue) },
          })
          analytics.logChangeSearchLocation({
            type: 'venue',
            venueId: (selectedPlaceOrVenue as SuggestedVenue).venueId,
          })
        }
      }

      navigate(
        ...getTabNavConfig('Search', {
          ...additionalSearchState,
        })
      )
      hideModal()
    },
    [searchState, dispatchStagedSearch, navigate, hideModal, getValues]
  )

  const close = useCallback(() => {
    reset(defaultValues)
    hideModal()
  }, [defaultValues, hideModal, reset])

  const onResetPress = useCallback(() => {
    reset({
      locationChoice:
        position !== null ? RadioButtonLocation.AROUND_ME : RadioButtonLocation.EVERYWHERE,
      aroundRadius: MAX_RADIUS,
      searchPlaceOrVenue: '',
      selectedPlaceOrVenue: undefined,
    })
  }, [position, reset])

  const onSubmit = handleSubmit(search)

  /**
   * Helper to avoid using `setValue(x, y, { shouldValidate: true })`
   * since it's repetitive.
   */
  const setValueWithValidation = useCallback(
    <FieldName extends keyof LocationModalFormData>(
      fieldName: FieldName,
      value: LocationModalFormData[FieldName],
      options?: Omit<SetValueConfig, 'shouldValidate'>
    ) => {
      setValue(fieldName, value as never, { shouldValidate: true, ...options })
    },
    [setValue]
  )

  const handlePlaceOrVenueSelect = (placeOrVenue: SuggestedPlace | SuggestedVenue) => {
    setValueWithValidation('selectedPlaceOrVenue', placeOrVenue)
    setValueWithValidation('searchPlaceOrVenue', placeOrVenue.label)
    setIsSearchInputFocused(false)
    Keyboard.dismiss()
  }

  const handleSearchReset = useCallback(() => {
    setValueWithValidation('searchPlaceOrVenue', '')
    setValueWithValidation('selectedPlaceOrVenue', undefined)
  }, [setValueWithValidation])

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

      setValueWithValidation('locationChoice', locationChoice)
    },
    [
      logUseFilter,
      position,
      permissionState,
      showGeolocPermissionModal,
      requestGeolocPermission,
      setValueWithValidation,
    ]
  )

  const disabled = !isValid || (!isValidating && isSubmitting)

  const baseSliderContainerWidth = isDesktopViewport ? modal.desktopMaxWidth : appContentWidth
  /**
   * This hack is used to avoid the slider to be cropped.
   * FIXME(PC-17652): We should create a slider that automatically scales ? Without defining any width
   */
  const fixedBaseSliderContainerWidth = isDesktopViewport
    ? baseSliderContainerWidth
    : Math.min(appContentWidth, forms.maxWidth + modal.spacing.MD * 2)

  const sliderLength = fixedBaseSliderContainerWidth - modal.spacing.MD * 2 - slider.markerSize

  const onValuesChange = useCallback(
    (newValues: number[]) => {
      if (isVisible) {
        setValue('aroundRadius', newValues[0])
        logChangeRadius()
      }
    },
    [isVisible, logChangeRadius, setValue]
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
      isFullscreen
      noPadding
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
      keyboardShouldPersistTaps="handled">
      <FormWrapper>
        <Form.MaxWidth>
          <Controller
            control={control}
            name="locationChoice"
            render={({ field: { value } }) => (
              <React.Fragment>
                <StyledVerticalUl>
                  {LOCATION_TYPES.map((item, index) => (
                    <Li key={item.label}>
                      <Spacer.Column numberOfSpaces={6} />
                      <RadioButton
                        onSelect={() => onSelectLocation(item.label)}
                        isSelected={value === item.label}
                        testID={item.label}
                        {...item}
                      />
                      {item.label === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE &&
                      value === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE ? (
                        <React.Fragment>
                          <Spacer.Column numberOfSpaces={4} />
                          <SpaceBetween>
                            <Typo.Body>Rechercher un lieu</Typo.Body>
                            <Typo.Caption>Obligatoire</Typo.Caption>
                          </SpaceBetween>
                          <Spacer.Column numberOfSpaces={2} />
                          <Controller
                            control={control}
                            name="searchPlaceOrVenue"
                            render={({
                              field: { value: searchPlaceOrVenue, onChange: onPlaceSearchChange },
                            }) => (
                              <SearchInput
                                ref={searchPlaceOrVenueInputRef}
                                value={searchPlaceOrVenue}
                                onChangeText={(text) => {
                                  onPlaceSearchChange(text)
                                  setValueWithValidation('selectedPlaceOrVenue', undefined)
                                }}
                                placeholder="Saisis une adresse ou le nom d’un lieu"
                                inputHeight="regular"
                                accessibilityLabel="Recherche un lieu, une adresse"
                                onPressRightIcon={handleSearchReset}
                                onFocus={() => setIsSearchInputFocused(true)}
                                accessibilityDescribedBy={accessibilityDescribedBy}
                              />
                            )}
                          />
                          <HiddenAccessibleText displayBlock nativeID={accessibilityDescribedBy}>
                            indique un lieu pour découvrir toutes les offres de ce lieu puis clique
                            sur le lieu pour valider ton choix
                          </HiddenAccessibleText>
                          {isSearchInputFocused ? (
                            <React.Fragment>
                              <Spacer.Column numberOfSpaces={4} />
                              <SuggestedPlaces
                                query={debouncedSearchPlaceOrVenue}
                                setSelectedPlaceOrVenue={handlePlaceOrVenueSelect}
                              />
                            </React.Fragment>
                          ) : null}
                        </React.Fragment>
                      ) : null}
                      {item.label === RadioButtonLocation.AROUND_ME && (
                        <Controller
                          control={control}
                          name="aroundRadius"
                          render={({ field: { value: aroundRadius } }) => (
                            <React.Fragment>
                              {value === RadioButtonLocation.AROUND_ME && (
                                <View>
                                  <Spacer.Column numberOfSpaces={4} />
                                  <LabelRadiusContainer>
                                    <Typo.Body>{`Dans un rayon de\u00a0:`}</Typo.Body>
                                    <Typo.ButtonText>{`${aroundRadius}\u00a0km`}</Typo.ButtonText>
                                  </LabelRadiusContainer>
                                  <Spacer.Column numberOfSpaces={2} />
                                  <Slider
                                    showValues={false}
                                    values={[aroundRadius]}
                                    max={MAX_RADIUS}
                                    onValuesChange={onValuesChange}
                                    shouldShowMinMaxValues
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
                    </Li>
                  ))}
                </StyledVerticalUl>
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
      </FormWrapper>
    </AppModal>
  )
}

const FormWrapper = styled.View({
  alignItems: 'center',
})

const LabelRadiusContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const StyledVerticalUl = styled(VerticalUl)({
  overflow: 'hidden',
})

const SpaceBetween = styled.View({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})
