import React, { useEffect, useRef } from 'react'
import { TextInput } from 'react-native/Libraries/Components/TextInput/TextInput'
import styled, { useTheme } from 'styled-components/native'

import useSearchInVenueModal from 'features/search/pages/modals/SearchInVenueModal/useSearchInVenueModal'
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
  const { modal } = useTheme()
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [visible])

  return (
    <AppModal
      visible={visible}
      title="Rechercher une offre"
      isUpToStatusBar={false}
      modalSpacing={modal.spacing.MD}
      keyboardShouldPersistTaps="handled"
      maxHeight={500}
      shouldAddSpacerBetweenHeaderAndContent
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
        <SearchButtonContainer>
          <ButtonPrimary
            wording="Lancer la recherche"
            onPress={doApplySearch}
            disabled={isSearchButtonDisabled}
          />
        </SearchButtonContainer>
      }>
      <SearchInput
        ref={inputRef}
        LeftIcon={StyledMagnifyingGlass}
        onPressRightIcon={doResetVenue}
        onChangeText={setSearchInVenueQuery}
        value={searchInVenueQuery}
        label="Rechercher dans ce lieu"
      />
    </AppModal>
  )
}

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const HeaderContainer = styled.View(({ theme }) => ({
  paddingBottom: theme.modal.spacing.SM,
  width: '100%',
}))

const SearchButtonContainer = styled.View(({ theme }) => ({
  paddingTop: theme.modal.spacing.MD,
  paddingHorizontal: theme.modal.spacing.MD,
}))
