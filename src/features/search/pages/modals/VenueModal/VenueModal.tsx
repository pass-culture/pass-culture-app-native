import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import useVenueModal from 'features/search/pages/modals/VenueModal/useVenueModal'
import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { AppModal } from 'ui/components/modals/AppModal'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'

interface Props extends VenueModalHookProps {
  visible: boolean
  onClose?: VoidFunction
}

const titleId = uuidv4()
const title = 'Lieu culturel'

export const VenueModal = ({ visible, dismissModal, onClose: onParentClose }: Props) => {
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

  const handleClose = () => {
    onClose()
    onParentClose?.()
  }

  const onResetPress = () => {
    doResetVenue()
  }

  return (
    <AppModal
      visible={visible}
      title={title}
      isUpToStatusBar
      scrollEnabled={false}
      noPadding
      keyboardShouldPersistTaps="handled"
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={onClose}
          onClose={handleClose}
          shouldDisplayBackButton
          shouldDisplayCloseButton
        />
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

const Container = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
