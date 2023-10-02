import React, { useState } from 'react'
import styled from 'styled-components/native'

import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { Venue } from 'features/venue/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { AppModal } from 'ui/components/modals/AppModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
}

export const VenueModal = ({ visible, dismissModal }: Props) => {
  const [venueQuery, setVenueQuery] = useState('')
  const debouncedVenueQuery = useDebounceValue(venueQuery, 500)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const onChangeVenue = (text: string) => {
    setVenueQuery(text)
    setSelectedVenue(null)
  }

  const onResetVenue = () => {
    setVenueQuery('')
    setSelectedVenue(null)
  }

  const onSetSelectedVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setVenueQuery(venue.label)
  }

  const isQueryProvided = !!venueQuery && !!debouncedVenueQuery
  const shouldShowSuggestedVenues = isQueryProvided && !selectedVenue

  return (
    <AppModal
      visible={visible}
      title={'Point de vente'}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={dismissModal}
      isUpToStatusBar
      scrollEnabled={false}
      fixedModalBottom={
        <React.Fragment>
          <ButtonPrimary
            wording={'Valider le point de vente'}
            disabled={!selectedVenue}
            onPress={dismissModal}
          />
          <KeyboardPlaceholder keyboardHeight={keyboardHeight} />
        </React.Fragment>
      }>
      <Spacer.Column numberOfSpaces={10} />
      <SubtitleContainer>
        <SearchIcon />
        <Spacer.Row numberOfSpaces={2} />
        <Typo.ButtonText>Trouver un point de vente </Typo.ButtonText>
      </SubtitleContainer>
      <Spacer.Column numberOfSpaces={4} />
      <SearchInput
        autoFocus
        LeftIcon={StyledMagnifyingGlass}
        inputHeight="regular"
        onChangeText={onChangeVenue}
        onPressRightIcon={onResetVenue}
        placeholder="Cinéma, librairie, magasin…"
        value={venueQuery}
      />
      {!!shouldShowSuggestedVenues && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <SuggestedVenues query={venueQuery} setSelectedVenue={onSetSelectedVenue} />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={4} />
    </AppModal>
  )
}

const SubtitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const SearchIcon = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const KeyboardPlaceholder = styled.View<{ keyboardHeight: number }>(({ keyboardHeight }) => ({
  height: keyboardHeight,
}))
