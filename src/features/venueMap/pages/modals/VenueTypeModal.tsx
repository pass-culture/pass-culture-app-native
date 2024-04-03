import React, { FunctionComponent, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { VenueTypeSection } from 'features/venueMap/components/VenueTypeSection/VenueTypeSection'
import { venueTypesMapping } from 'features/venueMap/helpers/venueTypesMapping/venueTypesMapping'
import { parseType, VenueTypeCode } from 'libs/parsers/venueType'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

type Props = {
  venueType: VenueTypeCode | null
  hideModal: VoidFunction
  isVisible?: boolean
}

const titleId = uuidv4()
const MODAL_TITLE = 'Type de lieu'

export const VenueTypeModal: FunctionComponent<Props> = ({
  venueType,
  hideModal,
  isVisible = false,
}) => {
  const { modal } = useTheme()

  const [venueTypeSelected, setVenueTypeSelected] = useState<string | null>(
    venueType ? parseType(venueType) : 'Tout'
  )

  const handleOnSelect = (venueTypeCode: VenueTypeCode | null) => {
    setVenueTypeSelected(venueTypeCode ? parseType(venueTypeCode) : 'Tout')
  }

  const handleOnReset = () => {
    setVenueTypeSelected('Tout')
  }

  const handleCloseModal = () => {
    handleOnReset()
    hideModal()
  }

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
          onSearchPress={handleCloseModal}
          isSearchDisabled={false}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      }>
      <Spacer.Column numberOfSpaces={3} />
      <Form.MaxWidth>
        <VerticalUl>
          <ListItem>
            <RadioButton
              label="Tout"
              isSelected={venueTypeSelected === 'Tout'}
              onSelect={() => handleOnSelect(null)}
            />
          </ListItem>
          <VenueTypeSection
            venueTypeSelected={venueTypeSelected}
            venueTypeMapping={venueTypesMapping.trip}
            onSelect={handleOnSelect}
          />
          <Separator.Horizontal />
          <VenueTypeSection
            venueTypeSelected={venueTypeSelected}
            venueTypeMapping={venueTypesMapping.shop}
            onSelect={handleOnSelect}
          />
          <Separator.Horizontal />
          <VenueTypeSection
            venueTypeSelected={venueTypeSelected}
            venueTypeMapping={venueTypesMapping.other}
            onSelect={handleOnSelect}
          />
        </VerticalUl>
      </Form.MaxWidth>
    </AppModal>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
