import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ModalSpacing } from 'ui/components/modals/enum'
import { Again } from 'ui/svg/icons/Again'
import { getSpacing } from 'ui/theme'

type Props = {
  isModal?: boolean
  onResetPress: () => void
  onSearchPress: () => void
  children?: never
}

export const FilterPageButtons: FunctionComponent<Props> = ({
  isModal = false,
  onResetPress,
  onSearchPress,
}) => {
  return (
    <Container isModal={isModal}>
      <ResetButton wording="Réinitialiser" icon={Again} onPress={onResetPress} />
      <SearchButton wording="Rechercher" onPress={onSearchPress} />
    </Container>
  )
}

const Container = styled.View<{ isModal: boolean }>(({ isModal }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  paddingHorizontal: ModalSpacing.MD,
  paddingTop: getSpacing(2),
  ...(!isModal ? { paddingBottom: ModalSpacing.MD } : {}),
}))

const ResetButton = styledButton(ButtonQuaternaryBlack)({
  width: 'auto',
  marginRight: getSpacing(4),
})

const SearchButton = styledButton(ButtonPrimary)({
  flexGrow: 1,
  width: 'auto',
})
