import React from 'react'
import { Pressable, Text, View } from 'react-native'
import styled from 'styled-components/native'

import { Scenario } from 'features/offerCtaPoc/fixtures/scenarios'
import { useBookingModal } from 'features/offerCtaPoc/hooks/useBookingModal'
import { useCtaDecision } from 'features/offerCtaPoc/hooks/useCtaDecision'

// VARIANT B: no ViewModel hook and no separate View — the component composes
// small single-responsibility use-case hooks directly (style A presentation).
// This is the alternative debated in RFC §5.3 / §10 Q1.

type Props = {
  scenario: Scenario
}

export const OfferCtas: React.FC<Props> = ({ scenario }) => {
  const { isLoading, decision } = useCtaDecision(scenario)
  const bookingModal = useBookingModal()

  if (isLoading || !decision) {
    return <Text testID="offerCta-loading">Chargement…</Text>
  }

  const onPress = () => {
    if (decision.isDisabled) return
    bookingModal.open()
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

      {bookingModal.isVisible ? (
        <View testID="offerCta-modal">
          <Text>Modale de réservation (POC)</Text>
          <Pressable accessibilityRole="button" onPress={bookingModal.close}>
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
