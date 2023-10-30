import React, { useState } from 'react'
import styled from 'styled-components/native'

import { VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import useVenueModal from 'features/search/pages/modals/VenueModal/useVenueModal'
import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { AppModal } from 'ui/components/modals/AppModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Again } from 'ui/svg/icons/Again'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Typo } from 'ui/theme'

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
    isVenueSelected,
    venueQuery,
  } = useVenueModal({ dismissModal, doAfterSearch })

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const onResetPress = () => {
    doResetVenue()
  }

  return (
    <AppModal
      visible={visible}
      title="Point de vente"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={dismissModal}
      isUpToStatusBar
      scrollEnabled={false}
      fixedModalBottom={
        <Container>
          <ResetButton wording="Réinitialiser" icon={Again} onPress={onResetPress} />
          <SearchButton
            wording="Rechercher"
            disabled={!isVenueSelected && !!venueQuery}
            onPress={doApplySearch}
          />
          <KeyboardPlaceholder keyboardHeight={keyboardHeight} />
        </Container>
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
    </AppModal>
  )
}

const ResetButton = styledButton(ButtonQuaternaryBlack)({
  width: 'auto',
  marginRight: getSpacing(4),
})

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

const Container = styled.View(({ theme }) => ({
  flexDirection: theme.appContentWidth > theme.breakpoints.xs ? 'row' : 'column',
  justifyContent: 'center',
  paddingTop: getSpacing(2),
}))

const SearchButton = styledButton(ButtonPrimary)({
  flexGrow: 1,
  width: 'auto',
})
