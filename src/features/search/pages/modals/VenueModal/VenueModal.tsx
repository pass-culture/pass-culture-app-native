import React from 'react'
import styled from 'styled-components/native'

import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { FilterBehaviour } from 'features/search/enums'
import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import useVenueModal from 'features/search/pages/modals/VenueModal/useVenueModal'
import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Typo } from 'ui/theme'

interface Props extends VenueModalHookProps {
  visible: boolean
}

export const VenueModal = ({ visible, dismissModal, doAfterSearch }: Props) => {
  const {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    shouldShowSuggestedVenues,
    venueQuery,
    isSearchButtonDisabled,
  } = useVenueModal({ dismissModal, doAfterSearch })

  const onResetPress = () => {
    doResetVenue()
  }

  return (
    <AppModal
      visible={visible}
      title=""
      isUpToStatusBar
      scrollEnabled={false}
      noPadding
      keyboardShouldPersistTaps="handled"
      customModalHeader={
        <HeaderContainer>
          <ModalHeader
            title="Localisation"
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={dismissModal}
          />
        </HeaderContainer>
      }
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={doApplySearch}
          onResetPress={onResetPress}
          isSearchDisabled={isSearchButtonDisabled}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      }>
      <StyledScrollView>
        <Spacer.Column numberOfSpaces={6} />
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
          onChangeText={doChangeVenue}
          onPressRightIcon={doResetVenue}
          placeholder="Cinéma, librairie, magasin…"
          value={venueQuery}
        />
        {!!shouldShowSuggestedVenues && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <SuggestedVenues query={venueQuery} setSelectedVenue={doSetSelectedVenue} />
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={4} />
      </StyledScrollView>
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

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.modal.spacing.MD,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.modal.spacing.SM,
  width: '100%',
}))
