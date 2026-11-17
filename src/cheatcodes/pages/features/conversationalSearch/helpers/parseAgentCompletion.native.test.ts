import { agentStudioCompletionStream } from 'cheatcodes/pages/features/conversationalSearch/fixtures/agentStudioCompletionStream'
import { parseCompletionStream } from 'cheatcodes/pages/features/conversationalSearch/helpers/parseCompletionStream'

import { getDisplayedOffers, parseAgentCompletion } from './parseAgentCompletion'

const agentStudioCompletion = parseCompletionStream(agentStudioCompletionStream)

const validHit = {
  objectID: '123',
  offer: { name: 'Offre valide', subcategoryId: 'CONCERT', prices: [12.5] },
  venue: { city: 'Lyon' },
}

const buildCompletion = (parts: unknown[]) => ({ id: 'alg_msg_test', role: 'assistant', parts })

describe('parseAgentCompletion', () => {
  it('should extract the answer text', () => {
    const { text } = parseAgentCompletion(agentStudioCompletion)

    expect(text).toContain('Si tu as envie de rap et de gros bangers à Lyon')
  })

  it('should extract the searches run by the agent', () => {
    const { searches } = parseAgentCompletion(agentStudioCompletion)

    expect(searches).toEqual([
      { queries: ['rap', 'rap', 'rap lyon'], nbHits: 16 },
      { queries: ['transbordeur', 'marché gare', 'feyzin', 'villeurbanne'], nbHits: 7 },
    ])
  })

  it('should return the offers found by every search', () => {
    const { offers } = parseAgentCompletion(agentStudioCompletion)

    expect(offers.map((offer) => offer.objectID)).toEqual([
      '440168507',
      '433325627',
      '410730081',
      '436947318',
    ])
  })

  it('should return the offers cited in the answer in citation order', () => {
    const { citedOffers, unknownCitedOfferIds } = parseAgentCompletion(agentStudioCompletion)

    expect(citedOffers.map((offer) => offer.objectID)).toEqual([
      '436947318',
      '410730081',
      '440168507',
    ])
    expect(unknownCitedOfferIds).toEqual([])
  })

  it('should convert prices to cents and build a production image url', () => {
    const { offers } = parseAgentCompletion(agentStudioCompletion)

    expect(offers[0]?.offer).toEqual(
      expect.objectContaining({
        name: 'PICHE',
        subcategoryId: 'CONCERT',
        prices: [3490],
        thumbUrl:
          'https://image-resizing.passculture.app/?size=256&filename=passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/458NK',
      })
    )
  })

  it('should return each offer once when several searches return it', () => {
    const completion = buildCompletion([
      { type: 'tool-algolia_search_index_production', output: { hits: [validHit] } },
      { type: 'tool-algolia_search_index_production', output: { hits: [validHit] } },
    ])

    const { offers } = parseAgentCompletion(completion)

    expect(offers.map((offer) => offer.objectID)).toEqual(['123'])
  })

  it('should list cited offers that no search returned', () => {
    const completion = buildCompletion([
      { type: 'tool-algolia_search_index_production', output: { hits: [validHit], nbHits: 1 } },
      { type: 'text', text: 'Voir https://passculture.app/offre/123 et /offre/999' },
    ])

    const { citedOffers, unknownCitedOfferIds } = parseAgentCompletion(completion)

    expect(citedOffers.map((offer) => offer.objectID)).toEqual(['123'])
    expect(unknownCitedOfferIds).toEqual(['999'])
  })

  it('should read hits from any part whatever its type', () => {
    const completion = buildCompletion([{ type: 'tool-renamed', output: { hits: [validHit] } }])

    const { offers, searches } = parseAgentCompletion(completion)

    expect(offers.map((offer) => offer.objectID)).toEqual(['123'])
    expect(searches).toEqual([{ queries: [], nbHits: 1 }])
  })

  it('should ignore malformed hits', () => {
    const completion = buildCompletion([
      {
        type: 'tool-algolia_search_index_production',
        output: {
          hits: [
            null,
            { objectID: 1, offer: validHit.offer },
            { objectID: '2', offer: { subcategoryId: 'NOT_A_SUBCATEGORY' } },
            { objectID: '3' },
            validHit,
          ],
        },
      },
    ])

    const { offers } = parseAgentCompletion(completion)

    expect(offers.map((offer) => offer.objectID)).toEqual(['123'])
  })

  it.each([undefined, null, 'text', [], {}, { parts: 'not-a-list' }])(
    'should return an empty completion when the response is %p',
    (raw) => {
      expect(parseAgentCompletion(raw)).toEqual({
        text: '',
        searches: [],
        offers: [],
        citedOffers: [],
        unknownCitedOfferIds: [],
      })
    }
  )
})

describe('getDisplayedOffers', () => {
  it('should return the cited offers when the answer cites some', () => {
    const completion = parseAgentCompletion(agentStudioCompletion)

    expect(getDisplayedOffers(completion)).toEqual(completion.citedOffers)
  })

  it('should return every offer when the answer cites none', () => {
    const completion = parseAgentCompletion(
      buildCompletion([{ type: 'tool-renamed', output: { hits: [validHit] } }])
    )

    expect(getDisplayedOffers(completion).map((offer) => offer.objectID)).toEqual(['123'])
  })
})
