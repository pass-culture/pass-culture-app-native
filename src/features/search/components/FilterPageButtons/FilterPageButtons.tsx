import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Again } from 'ui/svg/icons/Again'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  isModal?: boolean
  onResetPress: () => void
  onSearchPress: () => void
  isSearchDisabled?: boolean
  children?: never
}

export const FilterPageButtons: FunctionComponent<Props> = ({
  isModal = false,
  onResetPress,
  onSearchPress,
  isSearchDisabled,
}) => {
  return (
    <Container isModal={isModal}>
      <ResetButton wording="Réinitialiser" icon={Again} onPress={onResetPress} />
      <Spacer.Column numberOfSpaces={4} />
      <SearchButton wording="Rechercher" onPress={onSearchPress} disabled={isSearchDisabled} />
    </Container>
  )
}

const Container = styled.View<{ isModal: boolean }>(({ isModal, theme }) => ({
  flexDirection: theme.appContentWidth > theme.breakpoints.xs ? 'row' : 'column',
  justifyContent: 'center',
  paddingHorizontal: theme.modal.spacing.MD,
  paddingTop: getSpacing(2),
  ...(!isModal ? { paddingBottom: theme.modal.spacing.MD } : {}),
}))

const ResetButton = styledButton(ButtonQuaternaryBlack)({
  width: 'auto',
  marginRight: getSpacing(4),
})

const SearchButton = styledButton(ButtonPrimary)({
  flexGrow: 1,
  width: 'auto',
})
