import React from 'react'
import { Text } from 'react-native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

export const useReportOfferModalContent = () => {
  const childrenProps = {
    children: <Text>Composant modale</Text>,
    leftIcon: ArrowPrevious,
    onLeftIconPress: undefined,
    title: 'Titre modale',
  }
  return { childrenProps }
}
