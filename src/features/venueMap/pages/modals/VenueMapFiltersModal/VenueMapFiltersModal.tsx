import React, { FunctionComponent, PropsWithChildren } from 'react'
import { Platform, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { FilterBehaviour } from 'features/search/enums'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'

type Props = PropsWithChildren<{
  titleId: string
  title: string
  shouldDisplayBackButton: boolean
  shouldDisplayCloseButton: boolean
  handleOnClose: VoidFunction
  handleGoBack?: VoidFunction
}>

export const VenueMapFiltersModal: FunctionComponent<Props> = ({
  titleId,
  title,
  shouldDisplayBackButton,
  shouldDisplayCloseButton,
  handleOnClose,
  handleGoBack,
  children,
}) => {
  const { reset } = venuesFilterActions

  return (
    <React.Fragment>
      <HeaderContainer>
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={handleGoBack ?? handleOnClose}
          onClose={handleOnClose}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton={shouldDisplayCloseButton}
        />
      </HeaderContainer>
      <StyledScrollView>{children}</StyledScrollView>
      <ButtonsContainer>
        <FilterPageButtons
          onResetPress={reset}
          onSearchPress={handleOnClose}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      </ButtonsContainer>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
})

const StyledScrollView = styled(ScrollView)(({ theme }) => ({
  width: '100%',
  flex: 1,
  paddingHorizontal: theme.modal.spacing.MD,
}))

const ButtonsContainer = styled.View(({ theme }) => ({
  paddingBottom: Platform.OS === 'ios' ? theme.modal.spacing.MD : theme.modal.spacing.SM,
}))
