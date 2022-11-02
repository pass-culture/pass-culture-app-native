import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'

interface Props {
  offerId: number
}

export const AddToFavoritesButton: FunctionComponent<Props> = ({ offerId }) => {
  return <ButtonTertiaryPrimary wording="Mettre en favori" icon={StyledIcon} />
}

const StyledIcon = styled(FavoriteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
