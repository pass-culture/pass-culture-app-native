import React, { PropsWithChildren } from 'react'
import { Animated } from 'react-native'

import { OfferResponseV2 } from 'api/gen'

import { OfferHeaderView } from './OfferHeaderView'
import { useOfferHeader } from './useOfferHeader'

type OfferHeaderProps = PropsWithChildren<{
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  offer: OfferResponseV2
}>

/**
 * Wrapper d'intégration du header refactorisé.
 * Même API que l'ancien OfferHeader pour injection via HeaderComponent.
 *
 * @param props.headerTransition should be between animated between 0 and 1
 */
export function OfferHeader({
  headerTransition,
  title: _title,
  offer,
  children,
}: Readonly<OfferHeaderProps>) {
  const viewModel = useOfferHeader({ offer, headerTransition })

  return (
    <OfferHeaderView viewModel={viewModel} headerTransition={headerTransition}>
      {children}
    </OfferHeaderView>
  )
}
