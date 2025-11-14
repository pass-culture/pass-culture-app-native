import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SearchFixedModalBottomContainer } from 'features/search/components/SearchFixedModalBottomContainer'
import { useSearchInVenueModal } from 'features/search/pages/modals/SearchInVenueModal/useSearchInVenueModal'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import { Venue } from 'features/venue/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
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
  const theme = useTheme()

  return (
    <AppModal
      visible={visible}
      title="Rechercher une offre"
      isUpToStatusBar={!theme.isDesktopViewport}
      rightIcon={Close}
      onRightIconPress={onClose}
      keyboardShouldPersistTaps="handled"
      rightIconAccessibilityLabel="Fermer la modale"
      customModalHeader={
        <HeaderContainer>
          <ModalHeader
            title="Rechercher une offre"
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={onClose}
          />
        </HeaderContainer>
      }
      fixedModalBottom={
        <SearchFixedModalBottomContainer>
          <Container>
            <ButtonPrimary
              wording="Lancer la recherche"
              onPress={doApplySearch}
              disabled={isSearchButtonDisabled}
            />
          </Container>
        </SearchFixedModalBottomContainer>
      }>
      <SearchInputContainer>
        <SearchInput
          autoFocus
          onClear={doResetVenue}
          onChangeText={setSearchInVenueQuery}
          value={searchInVenueQuery}
          label="Rechercher dans ce lieu"
          onSubmitEditing={doApplySearch}
          testID="searchInput"
        />
      </SearchInputContainer>
    </AppModal>
  )
}

const SearchInputContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.xl,
}))

const HeaderContainer = styled.View({
  width: '100%',
})

const Container = styled.View({
  justifyContent: 'center',
})
