import React from 'react'
import waitForExpect from 'wait-for-expect'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { ParsedDescription } from 'libs/parsers/highlightLinks'
import { render, screen } from 'tests/utils'

import {
  OfferDescription,
  ExtendedKeys,
  formatValue,
  getContentFromOffer,
} from './OfferDescription'

let mockedOffer: Partial<OfferResponse> | undefined = offerResponseSnap
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

describe('<OfferDescription />', () => {
  it('should render', async () => {
    await render(<OfferDescription />)
    expect(screen.toJSON()).toMatchSnapshot()

    await waitForExpect(() => {
      expect(screen.getByText('En détails')).toBeTruthy()
      expect(screen.queryByText('Durée')).toBeNull()
    })
  })

  it('should render without description', async () => {
    mockedOffer = { ...offerResponseSnap, extraData: { durationMinutes: 20 }, description: '' }
    await render(<OfferDescription />)

    await waitForExpect(() => {
      expect(screen.getByText('Durée')).toBeTruthy()
      expect(screen.getByText('Author: photo credit author')).toBeTruthy()
      expect(screen.queryByText('En détails')).toBeNull()
    })
  })
})

const getField = (
  items: ReturnType<typeof getContentFromOffer>,
  key: ExtendedKeys
): string | ParsedDescription | undefined => {
  const item = items.find((it) => it.key === key)
  if (item) return item.value
  return undefined
}

describe('getContentFromOffer()', () => {
  it('add description if defined', () => {
    expect(getContentFromOffer({}, '')).toEqual([])
    expect(getField(getContentFromOffer({}, 'desc'), 'description')).toEqual(['desc'])
    expect(getField(getContentFromOffer({}, 'link https://link.com'), 'description')).toEqual([
      'link ',
      expect.anything(),
    ])
  })
  it('show relevant extraData, sorted', () => {
    expect(
      getContentFromOffer({ author: 'Tolkien', musicType: 'Rock' }, 'Weird combo')
    ).toMatchObject([
      { key: 'musicType', value: 'Rock' },
      { key: 'description', value: ['Weird combo'] },
      { key: 'author', value: 'Tolkien' },
    ])
  })
})

describe('formatValue()', () => {
  it.each`
    key                  | value    | expected
    ${'durationMinutes'} | ${20}    | ${'20m'}
    ${'durationMinutes'} | ${80}    | ${'1h20'}
    ${'durationMinutes'} | ${0}     | ${'0m'}
    ${'durationMinutes'} | ${'120'} | ${'2h'}
  `('should format $value to expected if key=$key', ({ key, value, expected }) => {
    expect(formatValue(key, value)).toBe(expected)
  })
})
