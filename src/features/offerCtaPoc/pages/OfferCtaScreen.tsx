import React, { useState } from 'react'
import styled from 'styled-components/native'

import { OfferCtas as OfferCtasVariantA } from 'features/offerCtaPoc/components/variantA/OfferCtas'
import { OfferCtas as OfferCtasVariantB } from 'features/offerCtaPoc/components/variantB/OfferCtas'
import { OfferCtas as OfferCtasVariantC } from 'features/offerCtaPoc/components/variantC/OfferCtas'
import { Scenario, SCENARIO_LABELS, SCENARIOS } from 'features/offerCtaPoc/fixtures/scenarios'
import { Typo } from 'ui/theme/typography'

// Dev-only comparison screen: pick a scenario, see both presentation variants
// side by side to check visual parity. NOT wired into production navigation
// (see POC-FINDINGS.md for the one-line cheatcode registration if needed).

const SCENARIO_KEYS = Object.keys(SCENARIOS) as Scenario[]

export const OfferCtaScreen: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('BOOKABLE')

  return (
    <Container>
      <Typo.Title3>POC — Offer CTA (A/B/C)</Typo.Title3>

      <Row>
        {SCENARIO_KEYS.map((key) => (
          <Chip
            key={key}
            active={scenario === key}
            accessibilityRole="button"
            onPress={() => setScenario(key)}>
            <Typo.Body>{SCENARIO_LABELS[key]}</Typo.Body>
          </Chip>
        ))}
      </Row>

      <Panel>
        <Typo.BodyAccent>Variante A — hook ViewModel</Typo.BodyAccent>
        <OfferCtasVariantA scenario={scenario} />
      </Panel>

      <Panel>
        <Typo.BodyAccent>Variante B — hooks use-case</Typo.BodyAccent>
        <OfferCtasVariantB scenario={scenario} />
      </Panel>

      <Panel>
        <Typo.BodyAccent>Variante C — ViewModel composé (hybride)</Typo.BodyAccent>
        <OfferCtasVariantC scenario={scenario} />
      </Panel>
    </Container>
  )
}

// Plain View (no ScrollView): the cheatcode template already provides scroll.
const Container = styled.View({ gap: 16 })

const Row = styled.View({ flexDirection: 'row', flexWrap: 'wrap', gap: 8 })

const Chip = styled.Pressable<{ active: boolean }>(({ theme, active }) => ({
  borderColor: theme.colors.primary,
  borderWidth: 1,
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: active ? theme.colors.primary : undefined,
}))

const Panel = styled.View(({ theme }) => ({
  borderColor: theme.colors.greyMedium,
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  gap: 8,
}))
