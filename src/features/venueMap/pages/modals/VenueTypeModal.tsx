import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { VenueTypeSection } from 'features/venueMap/components/VenueTypeSection/VenueTypeSection'
import { useVenueMapState } from 'features/venueMap/context/VenueMapWrapper'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'
import { venueTypesMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

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
  const { venueMapState, dispatch } = useVenueMapState()

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<VenueTypeModalFormProps>({
    defaultValues: {
      venueTypeCode: venueMapState.venueTypeCode,
    },
  })
  const { venueTypeCode } = watch()
  const venueTypeLabel = useMemo(() => getVenueTypeLabel(venueTypeCode), [venueTypeCode])

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
      venueTypeCode: venueMapState.venueTypeCode,
    })
    hideModal()
  }, [hideModal, reset, venueMapState.venueTypeCode])

  const handleSearchPress = useCallback(
    (form: VenueTypeModalFormProps) => {
      dispatch({ type: 'SET_VENUE_TYPE_CODE', payload: form.venueTypeCode })
      hideModal()
    },
    [dispatch, hideModal]
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
      <Spacer.Column numberOfSpaces={3} />
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
              />
              {index < array.length - 1 ? <Separator.Horizontal /> : null}
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
