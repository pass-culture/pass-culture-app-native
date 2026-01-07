import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { FilterBehaviour } from 'features/search/enums'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
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
  const theme = useTheme()
  const defautlFlexDirection = theme.appContentWidth > theme.breakpoints.xs ? 'row' : 'column'
  const flexDirection = useFontScaleValue<'row' | 'column'>({
    default: defautlFlexDirection,
    at200PercentZoom: 'column',
  })

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
    <Container isModal={isModal} flexDirection={flexDirection} gap={4}>
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

const Container = styled(ViewGap)<{ isModal: boolean; flexDirection: 'row' | 'column' }>(({
  isModal,
  flexDirection,
  theme,
}) => {
  return {
    flexDirection,
    justifyContent: 'center',
    paddingHorizontal: theme.modal.spacing.MD,
    paddingTop: theme.designSystem.size.spacing.s,
    ...(isModal ? {} : { paddingBottom: theme.modal.spacing.MD }),
  }
})

const ResetButton = styledButton(ButtonQuaternaryBlack)({
  width: 'auto',
})

const SearchButton = styledButton(ButtonPrimary)({
  flexGrow: 1,
  width: 'auto',
})
