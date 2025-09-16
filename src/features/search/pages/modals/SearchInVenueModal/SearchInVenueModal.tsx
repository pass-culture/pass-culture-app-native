import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SearchFixedModalBottomContainer } from 'features/search/components/SearchFixedModalBottomContainer'
import { useSearchInVenueModal } from 'features/search/pages/modals/SearchInVenueModal/useSearchInVenueModal'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import { Venue } from 'features/venue/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

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
          LeftIcon={StyledMagnifyingGlass}
          onPressRightIcon={doResetVenue}
          onChangeText={setSearchInVenueQuery}
          value={searchInVenueQuery}
          label="Rechercher dans ce lieu"
          onSubmitEditing={doApplySearch}
        />
      </SearchInputContainer>
    </AppModal>
  )
}

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const SearchInputContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.modal.spacing.MD,
}))

const HeaderContainer = styled.View({
  width: '100%',
})

const Container = styled.View({
  justifyContent: 'center',
})
