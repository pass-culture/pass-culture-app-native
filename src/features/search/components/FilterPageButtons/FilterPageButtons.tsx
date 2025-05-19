import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FilterBehaviour } from 'features/search/enums'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Again } from 'ui/svg/icons/Again'
import { getSpacing } from 'ui/theme'

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
      <ResetButton
        wording="Réinitialiser"
        icon={Again}
        onPress={onResetPress}
        disabled={isResetDisabled}
      />
      <SearchButton
        wording={searchButtonText}
        onPress={onSearchPress}
        disabled={isSearchDisabled}
      />
    </Container>
  )
}

const Container = styled(ViewGap)<{ isModal: boolean }>(({ isModal, theme }) => ({
  flexDirection: theme.appContentWidth > theme.breakpoints.xs ? 'row' : 'column',
  justifyContent: 'center',
  paddingHorizontal: theme.modal.spacing.MD,
  paddingTop: getSpacing(2),
  ...(isModal ? {} : { paddingBottom: theme.modal.spacing.MD }),
}))

const ResetButton = styledButton(ButtonQuaternaryBlack)({
  width: 'auto',
})

const SearchButton = styledButton(ButtonPrimary)({
  flexGrow: 1,
  width: 'auto',
})
