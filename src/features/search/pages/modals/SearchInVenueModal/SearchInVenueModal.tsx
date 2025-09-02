import React from 'react'
import styled from 'styled-components/native'

import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import useSearchInVenueModal from 'features/search/pages/modals/SearchInVenueModal/useSearchInVenueModal'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

interface Props extends VenueModalHookProps {
  visible: boolean
}

export const SearchInVenueModal = ({ visible, dismissModal }: Props) => {
  const {
    doChangeVenue,
    doResetVenue,
    doApplySearch,
    searchInVenueQuery,
    isSearchButtonDisabled,
    isResetButtonDisabled,
    onClose,
  } = useSearchInVenueModal({ dismissModal })

  const onResetPress = () => {
    doResetVenue()
  }

  return (
    <AppModal
      visible={visible}
      title="Rechercher une offre"
      isUpToStatusBar={false}
      scrollEnabled={false}
      noPadding
      keyboardShouldPersistTaps="handled"
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
        <SearchFixedModalBottom
          onSearchPress={doApplySearch}
          onResetPress={onResetPress}
          isSearchDisabled={isSearchButtonDisabled}
          isResetDisabled={isResetButtonDisabled}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      }>
      <StyledScrollView>
        <Container>
          <SearchInput
            autoFocus
            LeftIcon={StyledMagnifyingGlass}
            inputHeight="regular"
            onChangeText={doChangeVenue}
            onPressRightIcon={doResetVenue}
            value={searchInVenueQuery}
            label="Rechercher dans ce lieu"
            disableClearButton
          />
        </Container>
      </StyledScrollView>
    </AppModal>
  )
}

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.modal.spacing.MD,
  marginTop: theme.designSystem.size.spacing.xl,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.modal.spacing.SM,
  width: '100%',
}))

const Container = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
