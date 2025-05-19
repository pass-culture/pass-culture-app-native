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
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing } from 'ui/theme'
import { Typo } from 'ui/theme/typography'

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
        <SubtitleContainer>
          <SearchIcon />
          <Typo.BodyAccent>Trouver un lieu culturel</Typo.BodyAccent>
        </SubtitleContainer>
        <Container>
          <SearchInput
            autoFocus
            LeftIcon={StyledMagnifyingGlass}
            inputHeight="regular"
            onChangeText={doChangeVenue}
            onPressRightIcon={doResetVenue}
            placeholder="Cinéma, librairie, magasin…"
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

const SubtitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(2),
})

const SearchIcon = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.modal.spacing.MD,
  marginTop: getSpacing(6),
}))

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.modal.spacing.SM,
  width: '100%',
}))

const Container = styled.View({
  marginVertical: getSpacing(4),
})
