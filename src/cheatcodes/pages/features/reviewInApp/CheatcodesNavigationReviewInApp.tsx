import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import {
  incrementOffersViewed,
  replayMigrationFromV1,
  resetCreditTrigger,
  resetHistory,
  resetOffersViewed,
  seedOffersViewedAtThresholdMinusOne,
  seedProfileStartedFast,
  seedProfileStartedSlow,
  seedPromptNow,
  seedPromptOutOfLock,
  seedQuotaSaturated,
  seedV1Data,
} from 'cheatcodes/pages/features/reviewInApp/reviewInAppCheatcodeActions'
import {
  ReviewInAppCheatcodeState,
  useReviewInAppCheatcodeState,
} from 'cheatcodes/pages/features/reviewInApp/useReviewInAppCheatcodeState'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { OFFERS_VIEWED_REVIEW_THRESHOLD, ReviewTriggerSource } from 'libs/reviewInApp/types'
import { useReviewInApp } from 'libs/reviewInApp/useReviewInApp'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Typo } from 'ui/theme'

const reviewInAppCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'In-App Review ⭐',
  navigationTarget: {
    screen: 'CheatcodesNavigationReviewInApp',
  },
  subscreens: [],
}

export const cheatcodesNavigationReviewInAppButtons: CheatcodeCategory[] = [
  reviewInAppCheatcodeCategory,
]

const TRIGGERS: { source: ReviewTriggerSource; label: string; productionDelayHint: string }[] = [
  { source: 'booking_success', label: 'Booking success', productionDelayHint: '3s en prod' },
  {
    source: 'credit_received',
    label: 'Credit received',
    productionDelayHint: '2s en prod (BeneficiaryAccountCreated)',
  },
  { source: 'booking_liked', label: 'Booking liked', productionDelayHint: '3s en prod' },
  { source: 'offers_viewed', label: 'Offers viewed (10th)', productionDelayHint: '2s en prod' },
]

const TRIGGER_DELAY_MS = 1000

const formatDate = (timestamp: number | null): string => {
  if (timestamp === null) return '—'
  return new Date(timestamp).toLocaleString()
}

export function CheatcodesNavigationReviewInApp(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const { navigate } = useNavigation<UseNavigationType>()
  const { state, refresh } = useReviewInAppCheatcodeState()
  const { requestReview } = useReviewInApp()

  const wrap = (label: string, action: () => Promise<void>) => async () => {
    await action()
    await refresh()
    showSuccessSnackBar(label)
  }

  const triggerSource = (source: ReviewTriggerSource, label: string) => () => {
    void requestReview(source, { delayMs: TRIGGER_DELAY_MS })
    showSuccessSnackBar(`Trigger "${label}" envoyé (délai ${TRIGGER_DELAY_MS}ms)`)
  }

  const goToFeatureFlags = () => {
    navigate('CheatcodesStackNavigator', { screen: 'CheatcodesScreenFeatureFlags' })
  }

  return (
    <CheatcodesTemplateScreen
      title={reviewInAppCheatcodeCategory.title}
      onGoBack={goBack}
      flexDirection="column">
      <Section gap={2}>
        <Typo.Title3>État actuel</Typo.Title3>
        <StateBlock state={state} />
      </Section>

      <StyledSeparator />

      <Section gap={2}>
        <Typo.Title3>Manipulation du storage</Typo.Title3>
        <Button
          wording="Ajouter un prompt maintenant"
          onPress={wrap('Prompt ajouté à maintenant', seedPromptNow)}
        />
        <Button
          wording="Ajouter un prompt il y a 31 jours (sort du verrou)"
          onPress={wrap('Prompt ajouté hors verrou', seedPromptOutOfLock)}
        />
        <Button
          wording="Saturer le quota (3 prompts récents)"
          onPress={wrap('Quota saturé', seedQuotaSaturated)}
        />
        <Button wording="Vider l’historique" onPress={wrap('Historique vidé', resetHistory)} />
        <Button
          wording="Injecter des données V1"
          onPress={wrap('Données V1 injectées', seedV1Data)}
        />
        <Button
          wording="Rejouer la migration V1 → V2"
          onPress={wrap('Migration V1 rejouée', replayMigrationFromV1)}
        />
      </Section>

      <StyledSeparator />

      <Section gap={2}>
        <Typo.Title3>Compteur «&nbsp;offres consultées&nbsp;»</Typo.Title3>
        <Typo.BodyAccentS>
          Seuil&nbsp;: {OFFERS_VIEWED_REVIEW_THRESHOLD} consultations → trigger automatique sur la
          page d’offre.
        </Typo.BodyAccentS>
        <Button
          wording="Incrémenter d’1 (simuler une vue d’offre)"
          onPress={wrap('Compteur +1', incrementOffersViewed)}
        />
        <Button
          wording={`Placer le compteur à ${OFFERS_VIEWED_REVIEW_THRESHOLD - 1} (1 vue avant trigger)`}
          onPress={wrap('Compteur au seuil-1', seedOffersViewedAtThresholdMinusOne)}
        />
        <Button
          wording="Réinitialiser le compteur"
          onPress={wrap('Compteur remis à 0', resetOffersViewed)}
        />
      </Section>

      <StyledSeparator />

      <Section gap={2}>
        <Typo.Title3>Trigger crédit rapide ⚡</Typo.Title3>
        <Typo.BodyAccentS>
          Crédit reçu en moins de 24h après le début du profil → prompt sur la page de crédit
          débloqué (BeneficiaryAccountCreated) après 2s.
        </Typo.BodyAccentS>
        <Button
          wording="Simuler début profil il y a 1h (rapide)"
          onPress={wrap('Début profil à -1h', seedProfileStartedFast)}
        />
        <Button
          wording="Simuler début profil il y a 48h (lent)"
          onPress={wrap('Début profil à -48h', seedProfileStartedSlow)}
        />
        <Button
          wording="Réinitialiser le trigger crédit"
          onPress={wrap('Trigger crédit réinitialisé', resetCreditTrigger)}
        />
      </Section>

      <StyledSeparator />

      <Section gap={2}>
        <Typo.Title3>Déclencher manuellement</Typo.Title3>
        <Typo.BodyAccentS>
          Appelle requestReview(source) avec un délai de {TRIGGER_DELAY_MS}ms.
        </Typo.BodyAccentS>
        {TRIGGERS.map(({ source, label, productionDelayHint }) => (
          <ViewGap key={source} gap={1}>
            <Button wording={label} onPress={triggerSource(source, label)} />
            <Typo.BodyItalic>
              source: {source} — {productionDelayHint}
            </Typo.BodyItalic>
          </ViewGap>
        ))}
      </Section>

      <StyledSeparator />

      <Section gap={2}>
        <Typo.Title3>Feature flags</Typo.Title3>
        <Typo.BodyAccentS>Concernés&nbsp;:</Typo.BodyAccentS>
        <Typo.Body>• WIP_DISABLE_STORE_REVIEW (kill switch global)</Typo.Body>
        <Typo.Body>
          • WIP_REVIEW_TRIGGER_BOOKING / CREDIT / LIKE / OFFERS (si OFF, la source correspondante ne
          déclenche pas)
        </Typo.Body>
        <Button wording="Ouvrir l’écran Feature Flags" onPress={goToFeatureFlags} />
      </Section>
    </CheatcodesTemplateScreen>
  )
}

const StateBlock: React.FC<{ state: ReviewInAppCheatcodeState | null }> = ({ state }) => {
  if (!state) return <Typo.Body>Chargement…</Typo.Body>
  return (
    <ViewGap gap={1}>
      <Row label="Disponibilité native" value={state.isNativeAvailable ? 'Oui' : 'Non'} />
      <Row label="Kill switch" value={state.isKillSwitchOn ? 'Actif' : 'Inactif'} />
      <Row
        label="Peut afficher review"
        value={state.canRequest ? 'Oui' : 'Non'}
        emphasis={state.canRequest ? 'success' : 'error'}
      />
      <Row
        label="Prompts dans la fenêtre 365j"
        value={`${state.promptCount} (quota restant\u00a0: ${state.quotaRemaining}/3)`}
      />
      <Row label="Dernier prompt" value={formatDate(state.lastPromptAt)} />
      <Row label="Verrou actif jusqu’à" value={formatDate(state.lockUntil)} />
      <Row
        label="Offres consultées (trigger offers_viewed)"
        value={`${state.offersViewedCount} / ${state.offersViewedThreshold}`}
        emphasis={
          state.offersViewedCount >= state.offersViewedThreshold - 1 ? 'success' : undefined
        }
      />
      <Row label="Début profil (trigger crédit)" value={formatDate(state.profileStartedAt)} />
      {state.history.length > 0 ? (
        <ViewGap gap={1}>
          <Typo.BodyAccentS>Timestamps&nbsp;:</Typo.BodyAccentS>
          {state.history.map((ts) => (
            <Typo.BodyXs key={ts}>• {formatDate(ts)}</Typo.BodyXs>
          ))}
        </ViewGap>
      ) : null}
    </ViewGap>
  )
}

const Row: React.FC<{ label: string; value: string; emphasis?: 'success' | 'error' }> = ({
  label,
  value,
  emphasis,
}) => (
  <RowContainer>
    <Typo.BodyAccentS>{label}&nbsp;:</Typo.BodyAccentS>
    <RowValue emphasis={emphasis}>{value}</RowValue>
  </RowContainer>
)

const Section = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))

const RowContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: 4,
})

const RowValue = styled(Typo.Body)<{ emphasis?: 'success' | 'error' }>(({ theme, emphasis }) => ({
  color:
    emphasis === 'success'
      ? theme.designSystem.color.text.success
      : emphasis === 'error'
        ? theme.designSystem.color.text.error
        : undefined,
  flexShrink: 1,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))
