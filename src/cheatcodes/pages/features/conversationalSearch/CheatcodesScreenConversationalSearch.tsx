import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { AccessibilityInfo, Platform, View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import {
  ConversationalSearchExchange,
  ConversationalSearchQuestion,
} from 'cheatcodes/pages/features/conversationalSearch/components/ConversationalSearchExchange'
import {
  MAX_QUERY_LENGTH,
  SAMPLE_QUERIES,
} from 'cheatcodes/pages/features/conversationalSearch/constants'
import {
  getDisplayedOffers,
  parseAgentCompletion,
} from 'cheatcodes/pages/features/conversationalSearch/helpers/parseAgentCompletion'
import { ConversationMessage, Exchange } from 'cheatcodes/pages/features/conversationalSearch/types'
import { useConversationalSearchMutation } from 'cheatcodes/queries/useConversationalSearchMutation'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { storage } from 'libs/storage'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { Typo } from 'ui/theme'

const TITLE = 'Recherche conversationnelle 💬'
const AGENT_ID_STORAGE_KEY = 'conversational_search_agent_id'

const toMessage = (role: ConversationMessage['role'], text: string): ConversationMessage => ({
  role,
  parts: [{ type: 'text', text }],
})

const toMessages = (exchanges: Exchange[], question: string): ConversationMessage[] => [
  ...[...exchanges]
    .reverse()
    .flatMap(({ question: previousQuestion, completion }) =>
      completion?.text
        ? [toMessage('user', previousQuestion), toMessage('assistant', completion.text)]
        : []
    ),
  toMessage('user', question),
]

const getStatusMessage = (isPending: boolean, lastExchange?: Exchange): string => {
  if (isPending) return 'Recherche en cours…'
  if (!lastExchange) return ''
  if (!lastExchange.completion) return 'La recherche a échoué'
  const offersCount = getDisplayedOffers(lastExchange.completion).length
  return offersCount > 1
    ? `Réponse reçue, ${offersCount} offres`
    : `Réponse reçue, ${offersCount} offre`
}

export const CheatcodesScreenConversationalSearch = (): React.JSX.Element =>
  env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING ? <ConversationalSearch /> : <PageNotFound />

const ConversationalSearch = (): React.JSX.Element => {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const { params } = useRoute<UseRouteType<'CheatcodesScreenConversationalSearch'>>()
  const routeAgentId = params?.agentId

  const [agentId, setAgentId] = useState(routeAgentId ?? '')
  const [query, setQuery] = useState('')
  const [conversationId, setConversationId] = useState(() => uuidv4())
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const { mutateAsync: postCompletion, isPending } = useConversationalSearchMutation()

  useEffect(
    function restoreStoredAgentId() {
      if (routeAgentId) return
      const readStoredAgentId = async () => {
        const storedAgentId = await storage.readString(AGENT_ID_STORAGE_KEY)
        if (storedAgentId) setAgentId((currentAgentId) => currentAgentId || storedAgentId)
      }
      void readStoredAgentId()
    },
    [routeAgentId]
  )

  const statusMessage = getStatusMessage(isPending, exchanges[0])

  useEffect(
    function announceStatus() {
      if (statusMessage && Platform.OS !== 'web') {
        AccessibilityInfo.announceForAccessibility(statusMessage)
      }
    },
    [statusMessage]
  )

  const trimmedAgentId = agentId.trim()
  const isSendingDisabled = !trimmedAgentId || isPending

  const sendQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim()
    if (!question || isSendingDisabled) return

    void storage.saveString(AGENT_ID_STORAGE_KEY, trimmedAgentId)
    setQuery('')
    setPendingQuestion(question)

    try {
      const { raw, durationInMs } = await postCompletion({
        agentId: trimmedAgentId,
        conversationId,
        messages: toMessages(exchanges, question),
      })
      const completion = parseAgentCompletion(raw)
      setExchanges((previousExchanges) => [
        { id: uuidv4(), question, durationInMs, completion, raw },
        ...previousExchanges,
      ])
    } catch (error) {
      setExchanges((previousExchanges) => [
        { id: uuidv4(), question, error: getErrorMessage(error) },
        ...previousExchanges,
      ])
    } finally {
      setPendingQuestion(null)
    }
  }

  const startNewConversation = () => {
    setConversationId(uuidv4())
    setExchanges([])
  }

  return (
    <CheatcodesTemplateScreen
      title={TITLE}
      onGoBack={goBack}
      flexDirection="column"
      keyboardShouldPersistTaps="handled">
      <ViewGap gap={6}>
        <TextInput
          label="Identifiant de l’agent"
          value={agentId}
          onChangeText={setAgentId}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
        <SearchInput
          label="Décris ce que tu cherches"
          value={query}
          onChangeText={setQuery}
          maxLength={MAX_QUERY_LENGTH}
          onSubmitEditing={() => void sendQuestion(query)}
        />
        <ViewGap gap={2}>
          <Button
            wording="Envoyer"
            onPress={() => void sendQuestion(query)}
            disabled={isSendingDisabled || !query.trim()}
            isLoading={isPending}
            fullWidth
          />
          <Button
            wording="Nouvelle conversation"
            variant="tertiary"
            onPress={startNewConversation}
            disabled={isPending || !exchanges.length}
            fullWidth
          />
        </ViewGap>

        <ViewGap gap={2}>
          <Typo.BodyAccentXs>Requêtes types</Typo.BodyAccentXs>
          <SampleQueriesContainer>
            {SAMPLE_QUERIES.map((sampleQuery) => (
              <Button
                key={sampleQuery.label}
                wording={sampleQuery.label}
                accessibilityLabel={`Requête type\u00a0: ${sampleQuery.query}`}
                variant="secondary"
                size="small"
                onPress={() => void sendQuestion(sampleQuery.query)}
                disabled={isSendingDisabled}
              />
            ))}
          </SampleQueriesContainer>
        </ViewGap>

        <ViewGap gap={2}>
          {pendingQuestion ? <ConversationalSearchQuestion question={pendingQuestion} /> : null}
          <View accessibilityRole={AccessibilityRole.STATUS}>
            <Typo.BodyAccentXs>{statusMessage}</Typo.BodyAccentXs>
          </View>
        </ViewGap>

        {exchanges.map((exchange, index) => (
          <React.Fragment key={exchange.id}>
            {index > 0 ? <Separator.Horizontal /> : null}
            <ConversationalSearchExchange exchange={exchange} />
          </React.Fragment>
        ))}
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}

const SampleQueriesContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.designSystem.size.spacing.s,
}))
