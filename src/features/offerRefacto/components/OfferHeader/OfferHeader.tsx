import React, { PropsWithChildren } from 'react'
import { Animated } from 'react-native'

import { OfferResponse } from 'api/gen'

import { OfferHeaderView } from './OfferHeaderView'
import { useOfferHeader } from './useOfferHeader'

type OfferHeaderProps = PropsWithChildren<{
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  offer: OfferResponse
}>

export const OfferHeader = ({
  headerTransition,
  title: _title,
  offer,
  children,
}: Readonly<OfferHeaderProps>) => {
  const viewModel = useOfferHeader({ offer, headerTransition })

  return (
    <OfferHeaderView viewModel={viewModel} headerTransition={headerTransition}>
      {children}
    </OfferHeaderView>
  )
}
