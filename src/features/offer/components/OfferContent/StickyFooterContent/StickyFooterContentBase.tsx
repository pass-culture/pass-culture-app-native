import React, { FC, PropsWithChildren } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { FavoritesCTA } from 'features/offer/components/OfferContent/ComingSoonCTAs/FavoritesCTA'
import { FavoriteProps } from 'features/offer/types'
import { ModalSettings } from 'ui/components/modals/useModal'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { getShadow, getSpacing } from 'ui/theme'

export type StickyFooterContentProps = {
  offerId: number
  onPressFavoriteCTA: () => void
  onLayout?: (params: LayoutChangeEvent) => void
  favoriteAuthModal: ModalSettings
} & Partial<FavoriteProps>

type StickyFooterContentBaseProps = StickyFooterContentProps & PropsWithChildren

export const StickyFooterContentBase: FC<StickyFooterContentBaseProps> = ({
  onLayout,
  children,
  ...props
}) => {
  return (
    <StickyFooterWrapper onLayout={onLayout}>
      <FavoritesCTA {...props} caption="Cette offre sera bientôt disponible" />
      {children}
    </StickyFooterWrapper>
  )
}

const StickyFooterWrapper = styled(StickyBottomWrapper)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  paddingTop: theme.designSystem.size.spacing.l,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.s,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(5),
    shadowColor: theme.designSystem.color.background.lockedInverted,
    shadowOpacity: 0.25,
  }),
}))
