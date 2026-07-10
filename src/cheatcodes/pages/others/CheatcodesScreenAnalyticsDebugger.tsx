import React from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import {
  analyticsDebuggerActions,
  useAnalyticsDebuggerBubbleVisible,
  useAnalyticsDebuggerCaptureEnabled,
  useAnalyticsDebuggerEvents,
} from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import FilterSwitch from 'ui/components/FilterSwitch'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'

export const CheatcodesScreenAnalyticsDebugger = () => {
  const captureEnabled = useAnalyticsDebuggerCaptureEnabled()
  const bubbleVisible = useAnalyticsDebuggerBubbleVisible()
  const events = useAnalyticsDebuggerEvents()

  return (
    <CheatcodesTemplateScreen title="Analytics debugger 📈" flexDirection="column">
      <ViewGap gap={6}>
        <Typo.Body>
          Capture les événements analytics (taps, clics) avec leurs paramètres et affiche-les en
          temps réel dans un overlay. Sur mobile, la bulle flottante ouvre l’overlay et se déplace
          au doigt&nbsp;; un appui long avec 2 doigts n’importe où affiche ou masque la bulle, un
          appui long sur la bulle la masque.
        </Typo.Body>
        <CaptureRow>
          <Typo.BodyAccent>Capture des événements</Typo.BodyAccent>
          <FilterSwitch
            active={captureEnabled}
            toggle={() => analyticsDebuggerActions.setCaptureEnabled(!captureEnabled)}
            accessibilityLabel="Activer la capture des événements analytics"
            testID="analyticsDebuggerCaptureSwitch"
          />
        </CaptureRow>
        <CaptureRow>
          <Typo.BodyAccent>Bulle flottante</Typo.BodyAccent>
          <FilterSwitch
            active={bubbleVisible}
            toggle={() => analyticsDebuggerActions.setBubbleVisible(!bubbleVisible)}
            accessibilityLabel="Afficher la bulle flottante du debugger"
            testID="analyticsDebuggerBubbleSwitch"
          />
        </CaptureRow>
        <Typo.BodyS>{`${events.length} événement(s) capturé(s)`}</Typo.BodyS>
        <Button
          wording="Ouvrir l’overlay"
          onPress={analyticsDebuggerActions.showOverlay}
          color="brand"
          fullWidth
        />
        <Button
          wording="Vider les événements"
          onPress={analyticsDebuggerActions.clearEvents}
          variant="secondary"
          color="brand"
          fullWidth
          disabled={events.length === 0}
        />
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}

const CaptureRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
