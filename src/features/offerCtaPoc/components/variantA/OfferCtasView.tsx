import React from 'react'
import { Pressable, Text, View } from 'react-native'
import styled from 'styled-components/native'

import { OfferCtaViewModel } from 'features/offerCtaPoc/hooks/useOfferCtaViewModel'

// PURE presentation (humble object): no hook, no business logic — only the
// ViewModel in, JSX out. Testable from a ViewModel fixture.

type Props = {
  viewModel: OfferCtaViewModel
}

export const OfferCtasView: React.FC<Props> = ({ viewModel }) => {
  const { isLoading, decision, isBookingModalVisible, onPress, onCloseBookingModal } = viewModel

  if (isLoading || !decision) {
    return <Text testID="offerCta-loading">Chargement…</Text>
  }

  return (
    <View>
      <Cta
        accessibilityRole="button"
        disabled={decision.isDisabled}
        onPress={onPress}
        testID="offerCta-cta">
        <CtaLabel>{decision.wording}</CtaLabel>
      </Cta>

      {isBookingModalVisible ? (
        <View testID="offerCta-modal">
          <Text>Modale de réservation (POC)</Text>
          <Pressable accessibilityRole="button" onPress={onCloseBookingModal}>
            <Text>Fermer</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const Cta = styled(Pressable)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  backgroundColor: disabled ? theme.colors.greyMedium : theme.colors.primary,
  borderRadius: 8,
  padding: 12,
}))

const CtaLabel = styled(Text)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
  fontWeight: '600',
}))
