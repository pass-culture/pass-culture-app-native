import React from 'react'
import { Text } from 'react-native'

import { ArrowPreviousDeprecated as ArrowPrevious } from 'ui/svg/icons/ArrowPrevious_deprecated'

export const useReportOfferModalContent = () => {
  const childrenProps = {
    children: <Text>Composant modale</Text>,
    leftIcon: ArrowPrevious,
    onLeftIconPress: undefined,
    title: 'Titre modale',
  }
  return { childrenProps }
}
