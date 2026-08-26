import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useSearchInVenueModal } from 'features/search/pages/modals/SearchInVenueModal/useSearchInVenueModal'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import { Venue } from 'features/venue/types'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Button } from 'ui/designSystem/Button/Button'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { Close } from 'ui/svg/icons/Close'

interface Props extends VenueModalHookProps {
  visible: boolean
  venueSelected: Venue
  onBeforeNavigate: () => void
}

export const SearchInVenueModal = ({
  visible,
  dismissModal,
  venueSelected,
  onBeforeNavigate,
}: Props) => {
  const {
    doApplySearch,
    searchInVenueQuery,
    setSearchInVenueQuery,
    isSearchButtonDisabled,
    onClose,
    doResetVenue,
  } = useSearchInVenueModal({ dismissModal, venueSelected, onBeforeNavigate })
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)
  const theme = useTheme()
  const modalHeader = (
    <StyledModalHeader
      title="Rechercher une offre"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={onClose}
    />
  )
  const searchButton = (
    <StyledButton
      wording="Lancer la recherche"
      onPress={doApplySearch}
      disabled={isSearchButtonDisabled}
    />
  )
  const searchButtonForMobile = <Container paddingBottom={keyboardHeight}>{searchButton}</Container>

  return (
    <AppModal
      visible={visible}
      title="Rechercher une offre"
      isUpToStatusBar={!theme.isDesktopViewport}
      rightIcon={Close}
      onRightIconPress={onClose}
      keyboardShouldPersistTaps="handled"
      rightIconAccessibilityLabel="Fermer la modale"
      customModalHeader={modalHeader}
      fixedModalBottom={theme.isDesktopViewport ? undefined : searchButtonForMobile}>
      <StyledSearchInput
        onClear={doResetVenue}
        onChangeText={setSearchInVenueQuery}
        value={searchInVenueQuery}
        label="Rechercher dans ce lieu"
        onSubmitEditing={doApplySearch}
        testID="searchInput"
      />
      {theme.isDesktopViewport ? searchButton : null}
    </AppModal>
  )
}

const StyledSearchInput = styled(SearchInput)(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.xl,
}))

const StyledModalHeader = styled(ModalHeader)({
  width: '100%',
})

const StyledButton = styled(Button)({
  alignSelf: 'center',
})

const Container = styled.View<{ paddingBottom: number }>(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
}))
