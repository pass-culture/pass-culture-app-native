import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import {
  agentStudioCompletionStream,
  toCompletionStream,
} from 'cheatcodes/pages/features/conversationalSearch/fixtures/agentStudioCompletionStream'
import { env } from 'libs/environment/env'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { CheatcodesScreenConversationalSearch } from './CheatcodesScreenConversationalSearch'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('queries/subcategories/useSubcategoriesQuery')

const AGENT_ID = 'my-agent-id'
const AGENT_ID_LABEL = /Identifiant de l’agent/
const QUERY_LABEL = /Décris ce que tu cherches/
const ANSWER = /Si tu as envie de rap/

const fetchSpy = jest.spyOn(global, 'fetch')

const mockAgentResponse = (body: string, status = 200) =>
  fetchSpy.mockResolvedValueOnce(new Response(body, { status }))

const user = userEvent.setup()

const renderScreen = () => render(reactQueryProviderHOC(<CheatcodesScreenConversationalSearch />))

describe('<CheatcodesScreenConversationalSearch />', () => {
  beforeEach(async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    useRoute.mockReturnValue({ params: {} })
    await storage.clear('conversational_search_agent_id')
  })

  it('should display the not found page and call nothing outside of testing', () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false

    renderScreen()

    expect(screen.getByText('Page introuvable\u00a0!')).toBeOnTheScreen()
    expect(screen.queryByLabelText(QUERY_LABEL)).not.toBeOnTheScreen()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('should disable sending when there is no agent id', async () => {
    renderScreen()

    await user.type(screen.getByLabelText(QUERY_LABEL), 'un concert')

    expect(screen.getByText('Envoyer')).toBeDisabled()
    expect(screen.getByText('Gratuit')).toBeDisabled()
  })

  it('should fill the agent id from the route params', () => {
    useRoute.mockReturnValueOnce({ params: { agentId: 'route-agent-id' } })

    renderScreen()

    expect(screen.getByDisplayValue('route-agent-id')).toBeOnTheScreen()
  })

  it('should fill the agent id from the last one used', async () => {
    await storage.saveString('conversational_search_agent_id', 'stored-agent-id')

    renderScreen()

    expect(await screen.findByDisplayValue('stored-agent-id')).toBeOnTheScreen()
  })

  it('should call the agent and display its answer with the cited offers', async () => {
    mockAgentResponse(agentStudioCompletionStream)
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.type(screen.getByLabelText(QUERY_LABEL), 'du rap à Lyon')
    await user.press(screen.getByText('Envoyer'))

    expect(await screen.findByText(ANSWER)).toBeOnTheScreen()
    expect(screen.getByText('3 offres citées par l’agent')).toBeOnTheScreen()
    expect(screen.getByText('du rap à Lyon')).toBeOnTheScreen()
    expect(screen.getByText(/Réponse de l’agent · \d+,\d\ss/)).toBeOnTheScreen()
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining(`/agent-studio/1/agents/${AGENT_ID}/completions?`),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"text":"du rap à Lyon"'),
      })
    )
  })

  it('should display the question while the agent is answering', async () => {
    let resolveResponse: ((response: Response) => void) | undefined
    fetchSpy.mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveResponse = resolve
      })
    )
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.type(screen.getByLabelText(QUERY_LABEL), 'du rap à Lyon')
    await user.press(screen.getByText('Envoyer'))

    expect(await screen.findByText('Recherche en cours…')).toBeOnTheScreen()
    expect(screen.getByText('du rap à Lyon')).toBeOnTheScreen()

    resolveResponse?.(new Response(agentStudioCompletionStream))

    expect(await screen.findByText(ANSWER)).toBeOnTheScreen()
    expect(screen.queryByText('Recherche en cours…')).not.toBeOnTheScreen()
  })

  it('should remember the agent id once a question is sent', async () => {
    mockAgentResponse(agentStudioCompletionStream)
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.press(screen.getByText('Gratuit'))
    await screen.findByText(ANSWER)

    expect(await storage.readString('conversational_search_agent_id')).toEqual(AGENT_ID)
  })

  it('should send the previous exchange when the conversation goes on', async () => {
    mockAgentResponse(agentStudioCompletionStream)
    mockAgentResponse(agentStudioCompletionStream)
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.press(screen.getByText('Gratuit'))
    await screen.findByText(ANSWER)
    await user.type(screen.getByLabelText(QUERY_LABEL), 'et moins cher')
    await user.press(screen.getByText('Envoyer'))

    expect(await screen.findByText('et moins cher')).toBeOnTheScreen()
    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringMatching(
          /"role":"user".*gratuitement.*"role":"assistant".*Si tu as envie de rap.*"role":"user".*et moins cher/
        ),
      })
    )
  })

  it('should start from an empty history after a new conversation', async () => {
    mockAgentResponse(agentStudioCompletionStream)
    mockAgentResponse(agentStudioCompletionStream)
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.press(screen.getByText('Gratuit'))
    await screen.findByText(ANSWER)
    await user.press(screen.getByText('Nouvelle conversation'))

    expect(screen.queryByText(ANSWER)).not.toBeOnTheScreen()

    await user.press(screen.getByText('À deux'))
    await screen.findByText(ANSWER)

    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ body: expect.not.stringContaining('"role":"assistant"') })
    )
  })

  it('should display the error returned by the agent', async () => {
    mockAgentResponse(JSON.stringify({ name: 'ClientError', message: 'Agent not found.' }), 404)
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.press(screen.getByText('Gratuit'))

    expect(await screen.findByText(/Agent Studio a répondu 404.*Agent not found/)).toBeOnTheScreen()
  })

  it('should display the error sent while the agent is answering', async () => {
    mockAgentResponse(
      toCompletionStream([
        { type: 'error', errorText: 'Max steps per completion limit was reached' },
      ])
    )
    renderScreen()

    await user.type(screen.getByLabelText(AGENT_ID_LABEL), AGENT_ID)
    await user.press(screen.getByText('Gratuit'))

    expect(await screen.findByText('Max steps per completion limit was reached')).toBeOnTheScreen()
  })
})
