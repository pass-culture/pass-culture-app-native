import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useFavorite } from 'features/favorites/hooks/useFavorite'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
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
  const isFavorite = useFavorite({ offerId })

  const { mutate: addFavorite } = useAddFavoriteMutation({})

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
