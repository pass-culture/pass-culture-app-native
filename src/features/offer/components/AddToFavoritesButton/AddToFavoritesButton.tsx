import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useAddFavorite, useFavorite } from 'features/favorites/api'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Spacer } from 'ui/theme'

interface Props {
  offerId: number
  onFavoriteAdditionnalPress?: () => void
}

export const AddToFavoritesButton: FunctionComponent<Props> = ({
  offerId,
  onFavoriteAdditionnalPress,
}) => {
  const isFavorite = useFavorite({ offerId })

  const { mutate: addFavorite } = useAddFavorite({})

  const addToFavorite = () => {
    addFavorite({ offerId })
    onFavoriteAdditionnalPress && onFavoriteAdditionnalPress()
  }

  if (isFavorite) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryPrimary wording="Mettre en favori" icon={StyledIcon} onPress={addToFavorite} />
    </React.Fragment>
  )
}

const StyledIcon = styled(FavoriteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
