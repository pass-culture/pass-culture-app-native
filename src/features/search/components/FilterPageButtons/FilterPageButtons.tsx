import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FilterBehaviour } from 'features/search/enums'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Again } from 'ui/svg/icons/Again'

type Props = {
  onResetPress: () => void
  onSearchPress: () => void
  filterBehaviour: FilterBehaviour
  isModal?: boolean
  isSearchDisabled?: boolean
  children?: never
  isResetDisabled?: boolean
}

export const FilterPageButtons: FunctionComponent<Props> = ({
  isModal = false,
  onResetPress,
  onSearchPress,
  filterBehaviour,
  isSearchDisabled,
  isResetDisabled,
}) => {
  let searchButtonText = ''
  switch (filterBehaviour) {
    case FilterBehaviour.SEARCH: {
      searchButtonText = 'Rechercher'
      break
    }
    case FilterBehaviour.APPLY_WITHOUT_SEARCHING: {
      searchButtonText = 'Appliquer le filtre'
      break
    }
  }

  return (
    <Container isModal={isModal} gap={4}>
      <ResetButtonWrapper>
        <Button
          wording="Réinitialiser"
          icon={Again}
          onPress={onResetPress}
          disabled={isResetDisabled}
          variant="tertiary"
          color="neutral"
          size="small"
        />
      </ResetButtonWrapper>
      <SearchButtonWrapper>
        <Button
          wording={searchButtonText}
          onPress={onSearchPress}
          disabled={isSearchDisabled}
          color="brand"
          fullWidth
        />
      </SearchButtonWrapper>
    </Container>
  )
}

const Container = styled(ViewGap)<{ isModal: boolean }>(({ isModal, theme }) => {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: theme.modal.spacing.MD,
    paddingTop: theme.designSystem.size.spacing.s,
    ...(isModal ? {} : { paddingBottom: theme.modal.spacing.MD }),
  }
})

const ResetButtonWrapper = styled.View({
  width: 'auto',
  flexShrink: 0,
})

const SearchButtonWrapper = styled.View({
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  minWidth: 0,
})
