import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalSpacing } from 'ui/components/modals/enum'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

export enum RadioButtonLocation {
  EVERYWHERE = 'Partout',
  AROUND_ME = 'Autour de moi',
  CHOOSE_PLACE_OR_VENUE = 'Choisir un lieu',
}

type LocationModalFormData = {
  locationChoice: RadioButtonLocation
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
  const { navigate } = useNavigation<UseNavigationType>()
  const { isDesktopViewport } = useTheme()
  const { searchState } = useSearch()
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useGeolocation()

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
            aroundRadius: MAX_RADIUS,
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
    [hideModal, navigate, searchState]
  )

  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting, isValid, isValidating },
    control,
  } = useForm<LocationModalFormData>({
    mode: 'onChange',
    defaultValues: {
      locationChoice: getLocationChoice() || RadioButtonLocation.EVERYWHERE,
    },
  })

  const close = useCallback(() => {
    reset({
      locationChoice: getLocationChoice(),
    })
    hideModal()
  }, [reset, getLocationChoice, hideModal])

  const onSubmit = handleSubmit(search)

  const onResetPress = useCallback(() => {
    reset({
      locationChoice: RadioButtonLocation.EVERYWHERE,
    })
  }, [reset])

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
            await requestGeolocPermission()
          }
        }
      }

      setValue('locationChoice', locationChoice)
    },
    [showGeolocPermissionModal, requestGeolocPermission, permissionState, position, setValue]
  )

  const disabled = !isValid || (!isValidating && isSubmitting)

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
      modalSpacing={ModalSpacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={close}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={disabled}
        />
      }>
      <Form.MaxWidth>
        <Controller
          control={control}
          name="locationChoice"
          render={() => (
            <React.Fragment>
              {LOCATION_TYPES.map((item, index) => (
                <View key={item.label}>
                  <Spacer.Column numberOfSpaces={6} />
                  <RadioButton
                    onSelect={() => onSelectLocation(item.label)}
                    isSelected={getValues('locationChoice') === item.label}
                    testID={item.label}
                    {...item}
                  />
                  <Spacer.Column numberOfSpaces={6} />
                  {index + 1 < LOCATION_TYPES.length && <Separator />}
                </View>
              ))}
              <InputError
                visible={!!positionError}
                messageId={positionError?.message}
                numberOfSpacesTop={1}
              />
            </React.Fragment>
          )}
        />
      </Form.MaxWidth>
    </AppModal>
  )
}
