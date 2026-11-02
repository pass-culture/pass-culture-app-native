import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FavoriteType } from 'features/favorites/enum'
import { useOfferFavorite } from 'features/favorites/hooks/useOfferFavorite'
import { useAddOfferFavoriteMutation } from 'queries/favorites/useAddOfferFavoriteMutation'
import { Button } from 'ui/designSystem/Button/Button'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'

interface Props {
  offerId: number
  onFavoriteAdditionnalPress?: () => void
}

export const AddToFavoritesButton: FunctionComponent<Props> = ({
  offerId,
  onFavoriteAdditionnalPress,
}) => {
  const isFavorite = useOfferFavorite({ offerId })

  const { mutate: addFavorite } = useAddOfferFavoriteMutation({ type: FavoriteType.OFFER })

  const addToFavorite = () => {
    addFavorite({ offerId })
    onFavoriteAdditionnalPress?.()
  }

  if (isFavorite) return null

  return (
    <Container>
      <Button
        wording="Mettre en favori"
        icon={StyledIcon}
        onPress={addToFavorite}
        variant="tertiary"
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  width: '100%',
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledIcon = styled(FavoriteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
