import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'

interface Props {
  offerId: number
}

export const AddToFavoritesButton: FunctionComponent<Props> = ({ offerId }) => {
  const isFavorite = useFavorite({ offerId })

  if (isFavorite) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryPrimary wording="Mettre en favori" icon={StyledIcon} />
    </React.Fragment>
  )
}

const StyledIcon = styled(FavoriteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
