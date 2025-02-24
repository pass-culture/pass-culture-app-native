import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { VenueTypeSection } from 'features/venueMap/components/VenueTypeSection/VenueTypeSection'
import { getGeolocatedVenues } from 'features/venueMap/helpers/getGeolocatedVenues/getGeolocatedVenues'
import { getVenuesNumberByType } from 'features/venueMap/helpers/getVenuesNumberByType/getVenuesNumberByType'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'
import { venueTypesMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'
import { setVenueTypeCode, useVenueMapStore } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers/venueType'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

type Props = {
  hideModal: VoidFunction
  isVisible?: boolean
}

type VenueTypeModalFormProps = {
  venueTypeCode: VenueTypeCode | null
}

const titleId = uuidv4()
const MODAL_TITLE = 'Type de lieu'

export const VenueTypeModal: FunctionComponent<Props> = ({ hideModal, isVisible = false }) => {
  const { modal } = useTheme()

  const venues = useVenueMapStore((state) => state.venues)
  const selectedVenue = useVenueMapStore((state) => state.selectedVenue)
  const defaultVenueTypeCode = useVenueMapStore((state) => state.venueTypeCode)

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<VenueTypeModalFormProps>({
    defaultValues: {
      venueTypeCode: defaultVenueTypeCode,
    },
  })
  const { venueTypeCode } = watch()
  const venueTypeLabel = useMemo(() => getVenueTypeLabel(venueTypeCode) ?? 'Tout', [venueTypeCode])

  const venueCountByTypes = venues.length
    ? getVenuesNumberByType(getGeolocatedVenues(venues, selectedVenue))
    : undefined

  const handleOnSelect = useCallback(
    (venueTypeCode: VenueTypeCode | null) => {
      setValue('venueTypeCode', venueTypeCode)
    },
    [setValue]
  )

  const handleOnReset = useCallback(() => {
    reset({ venueTypeCode: null })
  }, [reset])

  const handleCloseModal = useCallback(() => {
    reset({
      venueTypeCode: defaultVenueTypeCode,
    })
    hideModal()
  }, [hideModal, reset, defaultVenueTypeCode])

  const handleSearchPress = useCallback(
    (form: VenueTypeModalFormProps) => {
      setVenueTypeCode(form.venueTypeCode)
      if (form.venueTypeCode)
        analytics.logApplyVenueMapFilter({ venueType: MAP_VENUE_TYPE_TO_LABEL[form.venueTypeCode] })
      hideModal()
    },
    [hideModal]
  )

  return (
    <AppModal
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={MODAL_TITLE}
          onClose={handleCloseModal}
          onGoBack={handleCloseModal}
          shouldDisplayBackButton={false}
          shouldDisplayCloseButton
        />
      }
      title={MODAL_TITLE}
      visible={isVisible}
      isUpToStatusBar
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel="Ne pas filtrer sur un type de lieu et retourner à la carte"
      rightIcon={Close}
      onRightIconPress={handleCloseModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onResetPress={handleOnReset}
          onSearchPress={handleSubmit(handleSearchPress)}
          isSearchDisabled={isSubmitting}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      }>
      <Form.MaxWidth>
        <VerticalUl>
          <ListItem>
            <RadioButton
              label="Tout"
              isSelected={venueTypeLabel === 'Tout'}
              onSelect={() => handleOnSelect(null)}
            />
          </ListItem>
          {Object.entries(venueTypesMapping).map(([sectionKey, venueTypes], index, array) => (
            <React.Fragment key={sectionKey}>
              <VenueTypeSection
                venueTypeSelected={venueTypeLabel}
                venueTypeMapping={venueTypes}
                onSelect={handleOnSelect}
                venueCountByTypes={venueCountByTypes}
              />
              {index < array.length - 1 ? <StyledSeparator /> : null}
            </React.Fragment>
          ))}
        </VerticalUl>
      </Form.MaxWidth>
    </AppModal>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(3),
})
