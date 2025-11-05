import React from 'react'
import styled from 'styled-components/native'

import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import useVenueModal from 'features/search/pages/modals/VenueModal/useVenueModal'
import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { Close } from 'ui/svg/icons/Close'

interface Props extends VenueModalHookProps {
  visible: boolean
}

export const VenueModal = ({ visible, dismissModal }: Props) => {
  const {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    shouldShowSuggestedVenues,
    venueQuery,
    isSearchButtonDisabled,
    isResetButtonDisabled,
    onClose,
  } = useVenueModal({ dismissModal })

  const onResetPress = () => {
    doResetVenue()
  }

  return (
    <AppModal
      visible={visible}
      title="Lieu culturel"
      isUpToStatusBar
      scrollEnabled={false}
      noPadding
      keyboardShouldPersistTaps="handled"
      customModalHeader={
        <HeaderContainer>
          <ModalHeader
            title="Lieu culturel"
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
            testID="searchInput"
            label="Trouver un lieu culturel"
            description="Exemple&nbsp;: Cinéma, librairie, magasin…"
            autoFocus
            onChangeText={doChangeVenue}
            onClear={doResetVenue}
            value={venueQuery}
          />
          {shouldShowSuggestedVenues ? (
            <SuggestedVenues query={venueQuery} setSelectedVenue={doSetSelectedVenue} />
          ) : null}
        </Container>
      </StyledScrollView>
    </AppModal>
  )
}

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
