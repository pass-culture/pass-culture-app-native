import React, { FunctionComponent, PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'

type Props = {
  titleId: string
  title: string
  shouldDisplayBackButton: boolean
  shouldDisplayCloseButton: boolean
  handleOnClose: VoidFunction
  handleGoBack?: VoidFunction
} & PropsWithChildren

export const VenueMapFiltersModal: FunctionComponent<Props> = ({
  titleId,
  title,
  shouldDisplayBackButton,
  shouldDisplayCloseButton,
  handleOnClose,
  handleGoBack,
  children,
}) => {
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
