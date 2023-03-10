import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { Controller, SetValueConfig, useForm } from 'react-hook-form'
import { Keyboard, View, TextInput as RNTextInput } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour, LocationType, RadioButtonLocation } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { locationSchema } from 'features/search/helpers/schema/locationSchema/locationSchema'
import { useGetFullscreenModalSliderLength } from 'features/search/helpers/useGetFullscreenModalSliderLength'
import { useSetFocusWithCondition } from 'features/search/helpers/useSetFocusWithCondition/useSetFocusWithCondition'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlaces/SuggestedPlaces'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { SuggestedPlace } from 'libs/place'
import { Venue } from 'libs/venue'
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
import { useDebounceValue } from 'ui/hooks/useDebounceValue'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

type LocationModalFormData = {
  locationChoice: RadioButtonLocation
  aroundRadius: number
  selectedPlaceOrVenue?: Venue | SuggestedPlace
  searchPlaceOrVenue: string
}

export type LocationModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
}

const LOCATION_TYPES = [
  { label: RadioButtonLocation.CHOOSE_PLACE_OR_VENUE, icon: LocationPointer },
  { label: RadioButtonLocation.AROUND_ME, icon: AroundMe },
  { label: RadioButtonLocation.EVERYWHERE, icon: Everywhere },
]

const formatKm = (km: number) => `${km}\u00a0km`

const titleId = uuidv4()
const accessibilityDescribedBy = uuidv4()
const radiusLabelId = uuidv4()

const getLocationChoice = (locationType: LocationType) => {
  if (locationType === LocationType.EVERYWHERE) {
    return RadioButtonLocation.EVERYWHERE
  } else if (locationType === LocationType.AROUND_ME) {
    return RadioButtonLocation.AROUND_ME
  } else {
    return RadioButtonLocation.CHOOSE_PLACE_OR_VENUE
  }
}

const getPlaceOrVenue = (searchState: SearchState) => {
  if (searchState.locationFilter.locationType === LocationType.VENUE) {
    return searchState.locationFilter.venue
  } else if (searchState.locationFilter.locationType === LocationType.PLACE) {
    return searchState.locationFilter.place
  } else {
    return undefined
  }
}
const getPlaceOrVenueLabel = (searchState: SearchState) => {
  const placeOrVenue = getPlaceOrVenue(searchState)
  return placeOrVenue?.label ?? ''
}

export const LocationModal: FunctionComponent<LocationModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const { searchState, dispatch } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { isDesktopViewport, modal } = useTheme()
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    onPressGeolocPermissionModalButton: onPressGeolocPermissionModalButtonDefault,
  } = useGeolocation()
  const searchPlaceOrVenueInputRef = useRef<RNTextInput | null>(null)
  const { sliderLength } = useGetFullscreenModalSliderLength()

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
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues = useMemo(() => {
    return {
      locationChoice: getLocationChoice(searchState.locationFilter.locationType),
      aroundRadius:
        searchState.locationFilter.locationType === LocationType.AROUND_ME
          ? searchState.locationFilter.aroundRadius || MAX_RADIUS
          : MAX_RADIUS,
      searchPlaceOrVenue: getPlaceOrVenueLabel(searchState),
      selectedPlaceOrVenue: getPlaceOrVenue(searchState),
    }
  }, [searchState])

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

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const watchedSearchPlaceOrVenue = watch('searchPlaceOrVenue')
  const debouncedSearchPlaceOrVenue = useDebounceValue(watchedSearchPlaceOrVenue, 500)
  const watchedLocationChoice = watch('locationChoice')
  useSetFocusWithCondition(
    watchedLocationChoice === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE,
    searchPlaceOrVenueInputRef
  )

  useEffect(() => {
    if (isVisible && searchPlaceOrVenueInputRef.current?.isFocused()) {
      setIsSearchInputFocused(true)
    }
  }, [isVisible, watchedSearchPlaceOrVenue])

  const search = useCallback(
    ({ locationChoice, selectedPlaceOrVenue, aroundRadius }: LocationModalFormData) => {
      let additionalSearchState: SearchState = { ...searchState }
      if (locationChoice === RadioButtonLocation.EVERYWHERE) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: { locationType: LocationType.EVERYWHERE },
        }
        analytics.logChangeSearchLocation({ type: 'everywhere' }, searchState.searchId)
      } else if (locationChoice === RadioButtonLocation.AROUND_ME) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: {
            locationType: LocationType.AROUND_ME,
            aroundRadius: getValues('aroundRadius'),
          },
        }
        analytics.logChangeSearchLocation({ type: 'aroundMe' }, searchState.searchId)
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
          analytics.logChangeSearchLocation({ type: 'place' }, searchState.searchId)
        } else {
          additionalSearchState = {
            ...additionalSearchState,
            locationFilter: {
              locationType: LocationType.VENUE,
              venue: selectedPlaceOrVenue as Venue,
            },
          }
          analytics.logChangeSearchLocation(
            {
              type: 'venue',
              venueId: (selectedPlaceOrVenue as Venue).venueId,
            },
            searchState.searchId
          )
        }
      }

      switch (filterBehaviour) {
        case FilterBehaviour.SEARCH: {
          analytics.logPerformSearch(additionalSearchState)
          navigate(...getTabNavConfig('Search', additionalSearchState))
          break
        }
        case FilterBehaviour.APPLY_WITHOUT_SEARCHING: {
          dispatch({ type: 'SET_STATE', payload: additionalSearchState })
          break
        }
      }
      hideModal()
    },
    [searchState, filterBehaviour, hideModal, getValues, navigate, dispatch]
  )

  const closeModal = useCallback(() => {
    reset(defaultValues)
    hideModal()
    setIsSearchInputFocused(false)
  }, [defaultValues, hideModal, reset])

  const close = useCallback(() => {
    closeModal()
    if (onClose) {
      onClose()
    }
  }, [closeModal, onClose])

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

  const handlePlaceOrVenueSelect = (placeOrVenue: SuggestedPlace | Venue) => {
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
            setIsLoading(true)
            await requestGeolocPermission({
              onAcceptance: () => {
                setIsLoading(false)
                setValueWithValidation('locationChoice', locationChoice)
              },
              onRefusal: () => {
                setIsLoading(false)
                showGeolocPermissionModal()
              },
            })
            return
          }
        }
      }

      if (locationChoice === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE) {
        setIsSearchInputFocused(true)
      }

      setValueWithValidation('locationChoice', locationChoice)
    },
    [
      permissionState,
      position,
      requestGeolocPermission,
      setValueWithValidation,
      showGeolocPermissionModal,
    ]
  )

  const disabled = !isValid || (!isValidating && isSubmitting)

  const onValuesChange = useCallback(
    (newValues: number[]) => {
      if (isVisible) {
        setValue('aroundRadius', newValues[0])
      }
    },
    [isVisible, setValue]
  )

  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader
            titleId={titleId}
            title={title}
            onGoBack={closeModal}
            onClose={close}
            shouldDisplayBackButton={shouldDisplayBackButton}
            shouldDisplayCloseButton
          />
        )
      }
      title={title}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={closeModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={disabled}
          filterBehaviour={filterBehaviour}
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
                        label={
                          item.label === RadioButtonLocation.EVERYWHERE && position === null
                            ? RadioButtonLocation.NO_LOCATION
                            : item.label
                        }
                        icon={item.icon}
                        isLoading={
                          item.label === RadioButtonLocation.AROUND_ME ? isLoading : undefined
                        }
                      />
                      {item.label === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE &&
                      value === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE ? (
                        <React.Fragment>
                          <Spacer.Column numberOfSpaces={4} />
                          <Controller
                            control={control}
                            name="searchPlaceOrVenue"
                            render={({
                              field: { value: searchPlaceOrVenue, onChange: onPlaceSearchChange },
                            }) => (
                              <SearchInput
                                ref={searchPlaceOrVenueInputRef}
                                label="Rechercher un lieu"
                                isRequiredField
                                value={searchPlaceOrVenue}
                                onChangeText={(text) => {
                                  onPlaceSearchChange(text)
                                  setValueWithValidation('selectedPlaceOrVenue', undefined)
                                }}
                                placeholder="Adresse, cinéma, musée..."
                                inputHeight="regular"
                                onPressRightIcon={handleSearchReset}
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
                                  <LabelRadiusContainer nativeID={radiusLabelId}>
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
                                    minMaxValuesComplement={`\u00a0km`}
                                    maxLabel="Dans un rayon de&nbsp;:"
                                    sliderLength={sliderLength}
                                    formatValues={formatKm}
                                    accessibilityLabelledBy={radiusLabelId}
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
