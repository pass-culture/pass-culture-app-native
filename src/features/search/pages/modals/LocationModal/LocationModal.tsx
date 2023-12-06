import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, SetValueConfig, useForm } from 'react-hook-form'
import { Keyboard, TextInput as RNTextInput } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationSlider } from 'features/search/components/LocationSlider/LocationSlider'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour, LocationType, RadioButtonLocation } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { locationSchema } from 'features/search/helpers/schema/locationSchema/locationSchema'
import { useSetFocusWithCondition } from 'features/search/helpers/useSetFocusWithCondition/useSetFocusWithCondition'
import { SuggestedPlacesOrVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlacesOrVenues'
import { SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { GeolocationActivationModal } from 'libs/location/geolocation/components/GeolocationActivationModal'
import { SuggestedPlace } from 'libs/place'
import { Form } from 'ui/components/Form'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
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
import { Spacer } from 'ui/theme'

type LocationModalFormData = {
  locationChoice: RadioButtonLocation
  aroundRadius: [number]
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

const titleId = uuidv4()
const accessibilityDescribedBy = uuidv4()

const getLocationChoice = (searchState: SearchState) => {
  const {
    locationFilter: { locationType },
    venue,
  } = searchState
  if (venue) {
    return RadioButtonLocation.CHOOSE_PLACE_OR_VENUE
  } else if (locationType === LocationType.EVERYWHERE) {
    return RadioButtonLocation.EVERYWHERE
  } else if (locationType === LocationType.AROUND_ME) {
    return RadioButtonLocation.AROUND_ME
  } else {
    return RadioButtonLocation.CHOOSE_PLACE_OR_VENUE
  }
}

const getPlaceOrVenue = (searchState: SearchState) => {
  if (searchState.venue) {
    return searchState.venue
  } else if (searchState.locationFilter.locationType === LocationType.AROUND_PLACE) {
    return searchState.locationFilter.place
  } else {
    return undefined
  }
}
const getPlaceOrVenueLabel = (searchState: SearchState) => {
  const placeOrVenue = getPlaceOrVenue(searchState)
  return placeOrVenue?.label ?? ''
}

function isValidAroundRadius(value: unknown): value is [number] {
  return (
    Array.isArray(value) && value.length === 1 && typeof value[0] === 'number' && !isNaN(value[0])
  )
}

function getValidAroundRadius(searchState: SearchState): [number] {
  if (searchState.locationFilter.locationType === LocationType.AROUND_ME) {
    const aroundRadius = searchState.locationFilter.aroundRadius
    if (typeof aroundRadius === 'number') {
      return [aroundRadius]
    }
  }

  return [MAX_RADIUS]
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
  const { modal } = useTheme()
  const {
    userPosition: position,
    userPositionError: positionError,
    permissionState,
    requestGeolocPermission,
    onPressGeolocPermissionModalButton: onPressGeolocPermissionModalButtonDefault,
  } = useLocation()
  const isGeolocated = !!position
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
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues = useMemo(() => {
    return {
      locationChoice: getLocationChoice(searchState),
      aroundRadius: getValidAroundRadius(searchState),
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
          venue: undefined,
        }
        analytics.logChangeSearchLocation({ type: 'everywhere' }, searchState.searchId)
      } else if (locationChoice === RadioButtonLocation.AROUND_ME) {
        additionalSearchState = {
          ...additionalSearchState,
          locationFilter: {
            locationType: LocationType.AROUND_ME,
            aroundRadius: getValues('aroundRadius')[0],
          },
          venue: undefined,
        }
        analytics.logChangeSearchLocation({ type: 'aroundMe' }, searchState.searchId)
      } else if (locationChoice === RadioButtonLocation.CHOOSE_PLACE_OR_VENUE) {
        if (Object.prototype.hasOwnProperty.call(selectedPlaceOrVenue, 'geolocation')) {
          const validAroundRadius = isValidAroundRadius(aroundRadius) ? aroundRadius[0] : MAX_RADIUS

          additionalSearchState = {
            ...additionalSearchState,
            locationFilter: {
              locationType: LocationType.AROUND_PLACE,
              place: selectedPlaceOrVenue as SuggestedPlace,
              aroundRadius: validAroundRadius,
            },
            venue: undefined,
          }
          analytics.logChangeSearchLocation({ type: 'place' }, searchState.searchId)
        } else {
          additionalSearchState = {
            ...additionalSearchState,
            venue: selectedPlaceOrVenue as Venue,
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
          navigate(...getTabNavConfig('Search', additionalSearchState))
          break
        }
        case FilterBehaviour.APPLY_WITHOUT_SEARCHING: {
          // Workaround: When on the search page and applying filters while entering a search query
          // or selecting an autocomplete item, the filter wasn't being applied correctly.
          // So, we navigate to the Search page and set the filter state with the location param.
          if (searchState.view === SearchView.Landing) {
            navigate(...getTabNavConfig('Search', additionalSearchState))
            break
          }
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
      locationChoice: isGeolocated ? RadioButtonLocation.AROUND_ME : RadioButtonLocation.EVERYWHERE,
      aroundRadius: [MAX_RADIUS],
      searchPlaceOrVenue: '',
      selectedPlaceOrVenue: undefined,
    })
  }, [isGeolocated, reset])

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

  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={closeModal}
          onClose={close}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={title}
      isUpToStatusBar
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
      <Spacer.Column numberOfSpaces={6} />
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
                              <SuggestedPlacesOrVenues
                                query={debouncedSearchPlaceOrVenue}
                                setSelectedPlaceOrVenue={handlePlaceOrVenueSelect}
                              />
                            </React.Fragment>
                          ) : null}
                        </React.Fragment>
                      ) : null}
                      {item.label === RadioButtonLocation.AROUND_ME &&
                      value === RadioButtonLocation.AROUND_ME ? (
                        <Controller control={control} name="aroundRadius" render={LocationSlider} />
                      ) : null}
                      <Spacer.Column numberOfSpaces={6} />
                      {index + 1 < LOCATION_TYPES.length && <Separator.Horizontal />}
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

const StyledVerticalUl = styled(VerticalUl)({
  overflow: 'hidden',
})
