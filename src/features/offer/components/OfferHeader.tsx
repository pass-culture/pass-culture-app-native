import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated } from 'react-native'

import { isApiError } from 'api/apiHelpers'
import {
  useAddFavorite,
  useFavorite,
  useRemoveFavorite,
} from 'features/favorites/pages/useFavorites'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { useShareOffer } from 'features/offer/services/useShareOffer'
import { analytics } from 'libs/firebase/analytics'
import { AnimatedHeader } from 'ui/components/headers/AnimatedHeader'
import { favoriteAnimateIcon } from 'ui/components/headers/animationHelpers'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
interface Props {
  headerTransition: Animated.AnimatedInterpolation
  title: string
  offerId: number
  description?: string
}

export const OfferHeader: React.FC<Props> = ({
  headerTransition,
  offerId,
  title,
  description,
}: Props) => {
  const favoriteInformations = useFavorite({ offerId })
  const { params } = useRoute<UseRouteType<'Offer'>>()
  const { showErrorSnackBar } = useSnackBarContext()
  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId === 'number') {
        const { from, moduleName, moduleId } = params
        analytics.logHasAddedOfferToFavorites({ from, offerId, moduleName, moduleId })
      }
    },
    onError: (error) => {
      showErrorSnackBar({
        message:
          isApiError(error) && error.content.code === 'MAX_FAVORITES_REACHED'
            ? t`Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.`
            : t`L'offre n'a pas été ajoutée à tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { mutate: removeFavorite } = useRemoveFavorite({
    onError: () => {
      showErrorSnackBar({
        message: t`L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  function onFavoritePress() {
    if (!favoriteInformations) {
      favoriteAnimateIcon(scaleFavoriteIconAnimatedValueRef.current)
      addFavorite({ offerId })
    } else if (favoriteInformations) {
      removeFavorite(favoriteInformations.id)
    }
  }

  return (
    <AnimatedHeader
      title={title}
      headerTransition={headerTransition}
      id={offerId}
      metaDescription={description}
      shareButton={{
        onSharePress: useShareOffer,
        shareContentTitle: t`Partager l'offre`,
      }}
      favoriteButton={{
        onFavoritePress,
        favoriteInformations,
      }}
    />
  )
}
