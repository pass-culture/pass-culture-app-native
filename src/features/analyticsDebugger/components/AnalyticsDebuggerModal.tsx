import React, { useState } from 'react'
import { Platform, View, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import {
  DebuggedAnalyticsEvent,
  analyticsDebuggerActions,
  useAnalyticsDebuggerCaptureEnabled,
  useAnalyticsDebuggerEvents,
  useAnalyticsDebuggerOverlayVisible,
} from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import FilterSwitch from 'ui/components/FilterSwitch'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

const formatParams = (params?: Record<string, unknown>): string => {
  if (!params || Object.keys(params).length === 0) return '{}'
  const entries = Object.entries(params).map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  return `{ ${entries.join(', ')} }`
}

// JSON.stringify drops keys with an undefined value: stringify them explicitly to keep the
// full params object visible, since a missing param is exactly what a QA is looking for.
const formatParamsPretty = (params?: Record<string, unknown>): string => {
  if (!params) return '{}'
  const definedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value === undefined ? 'undefined' : value])
  )
  return JSON.stringify(definedParams, null, 2)
}

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString('fr-FR', { hour12: false })

const formatEventAsText = (event: DebuggedAnalyticsEvent): string =>
  `${formatTime(event.timestamp)} ${event.name} → ${formatParams(event.params)}`

export const AnalyticsDebuggerModal = () => {
  const visible = useAnalyticsDebuggerOverlayVisible()
  const captureEnabled = useAnalyticsDebuggerCaptureEnabled()
  const events = useAnalyticsDebuggerEvents()
  const { height: windowHeight } = useWindowDimensions()
  const [selectedEvent, setSelectedEvent] = useState<DebuggedAnalyticsEvent | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const filteredEvents = searchValue
    ? events.filter((event) => event.name.toLowerCase().includes(searchValue.toLowerCase()))
    : events

  const closeModal = () => {
    setSelectedEvent(null)
    analyticsDebuggerActions.hideOverlay()
  }

  const copyEvents = () =>
    copyToClipboard({
      textToCopy: filteredEvents.map(formatEventAsText).join(LINE_BREAK),
      snackBarMessage: 'Événements copiés dans le presse-papier\u00a0!',
    })

  const copySelectedEvent = () => {
    if (!selectedEvent) return
    void copyToClipboard({
      textToCopy: `${selectedEvent.name}${LINE_BREAK}${formatParamsPretty(selectedEvent.params)}`,
      snackBarMessage: `${selectedEvent.name} copié dans le presse-papier\u00a0!`,
    })
  }

  const leftIconProps: ModalLeftIconProps = selectedEvent
    ? {
        leftIconAccessibilityLabel: 'Revenir à la liste des événements',
        leftIcon: ArrowPrevious,
        onLeftIconPress: () => setSelectedEvent(null),
      }
    : {}

  return (
    <AppModal
      visible={visible}
      title={selectedEvent ? selectedEvent.name : 'Analytics debugger'}
      titleNumberOfLines={1}
      // maxHeight constrains the scrollable list so the fixed bottom buttons stay on screen
      maxHeight={windowHeight * 0.7}
      {...leftIconProps}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={closeModal}
      onBackdropPress={closeModal}
      fixedModalBottom={
        selectedEvent ? (
          <BottomWrapper>
            <Button wording="Copier" onPress={copySelectedEvent} color="brand" fullWidth />
          </BottomWrapper>
        ) : (
          <BottomWrapper>
            <Button
              wording="Copier"
              onPress={copyEvents}
              color="brand"
              fullWidth
              disabled={filteredEvents.length === 0}
            />
            <Button
              wording="Vider"
              onPress={analyticsDebuggerActions.clearEvents}
              variant="secondary"
              color="brand"
              fullWidth
              disabled={events.length === 0}
            />
          </BottomWrapper>
        )
      }>
      {selectedEvent ? (
        <ContentContainer gap={4}>
          <Typo.BodyAccentXs>{formatTime(selectedEvent.timestamp)}</Typo.BodyAccentXs>
          <JsonText selectable testID="analyticsDebuggerEventDetail">
            {formatParamsPretty(selectedEvent.params)}
          </JsonText>
        </ContentContainer>
      ) : (
        <ContentContainer gap={4}>
          <CaptureRow>
            <Typo.BodyAccent>Capture des événements</Typo.BodyAccent>
            <FilterSwitch
              active={captureEnabled}
              toggle={() => analyticsDebuggerActions.setCaptureEnabled(!captureEnabled)}
              accessibilityLabel="Activer la capture des événements analytics"
              testID="analyticsDebuggerCaptureSwitch"
            />
          </CaptureRow>
          {events.length === 0 ? (
            <Typo.BodyS>
              Aucun événement capturé. Active la capture puis navigue dans l’app&nbsp;: les
              événements analytics (taps, clics) s’afficheront ici en temps réel. Tape un événement
              pour voir le détail de ses paramètres.
            </Typo.BodyS>
          ) : (
            <React.Fragment>
              <SearchInput
                label="Filtrer par nom d’événement"
                value={searchValue}
                onChangeText={setSearchValue}
                onClear={() => setSearchValue('')}
              />
              {filteredEvents.length === 0 ? (
                <Typo.BodyS>Aucun événement ne correspond à ce filtre.</Typo.BodyS>
              ) : (
                <View>
                  {filteredEvents.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      onPress={() => setSelectedEvent(event)}
                      accessibilityLabel={`Voir le détail de l’événement ${event.name}`}
                      testID="analyticsDebuggerEvent">
                      <EventRow>
                        <Typo.BodyAccentXs>
                          {formatTime(event.timestamp)}&nbsp;{event.name}
                        </Typo.BodyAccentXs>
                        <Typo.BodyXs numberOfLines={2}>{formatParams(event.params)}</Typo.BodyXs>
                      </EventRow>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </React.Fragment>
          )}
        </ContentContainer>
      )}
    </AppModal>
  )
}

const ContentContainer = styled(ViewGap)(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const CaptureRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const EventRow = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.m,
  gap: theme.designSystem.size.spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: theme.designSystem.color.border.subtle,
}))

const BottomWrapper = styled.View(({ theme }) => ({
  width: '100%',
  gap: theme.designSystem.size.spacing.s,
  paddingTop: theme.designSystem.size.spacing.l,
}))

const JsonText = styled(Typo.BodyXs)({
  fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
})
