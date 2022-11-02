import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { isApiError } from 'api/apiHelpers'
import { useAddFavorite, useFavorite } from 'features/favorites/api'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
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
  const { showErrorSnackBar } = useSnackBarContext()

  const { mutate: addFavorite, isLoading } = useAddFavorite({
    onSuccess: () => {
      onFavoriteAdditionnalPress && onFavoriteAdditionnalPress()
    },
    onError: (error) => {
      onFavoriteAdditionnalPress && onFavoriteAdditionnalPress()
      showErrorSnackBar({
        message:
          isApiError(error) && error.content.code === 'MAX_FAVORITES_REACHED'
            ? 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.'
            : 'L’offre n’a pas été ajoutée à tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  if (isFavorite && !isLoading) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryPrimary
        wording="Mettre en favori"
        icon={StyledIcon}
        onPress={() => addFavorite({ offerId })}
      />
    </React.Fragment>
  )
}

const StyledIcon = styled(FavoriteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
