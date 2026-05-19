import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Offers } from 'ui/svg/icons/Offers'
import { LINE_BREAK } from 'ui/theme/constants'

export const VerticalPlaylistError = () => {
  const { goBack } = useNavigation<UseNavigationType>()

  return (
    <GenericInfoPage
      illustration={Offers}
      title="Oups&nbsp;!"
      subtitle={`Une erreur est survenue.${LINE_BREAK}Veuillez réessayer plus tard.`}
      buttonPrimary={{ wording: 'Retourner à la page précédente', onPress: goBack }}
    />
  )
}
