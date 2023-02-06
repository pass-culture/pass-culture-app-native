import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { ParsedDescription } from 'libs/parsers/highlightLinks'
import { render, screen, waitFor } from 'tests/utils'

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
    render(<OfferDescription />)

    await waitFor(() => {
      expect(screen.toJSON()).toMatchSnapshot()
      expect(screen.getByText('En détails')).toBeTruthy()
      expect(screen.queryByText('Durée')).toBeNull()
    })
  })

  it('should render without description', async () => {
    mockedOffer = { ...offerResponseSnap, extraData: { durationMinutes: 20 }, description: '' }
    render(<OfferDescription />)
    await waitFor(() => {
      expect(screen.getByText('Durée')).toBeTruthy()
      expect(screen.getByText('Author: photo credit author')).toBeTruthy()
      expect(screen.queryByText('En détails')).toBeNull()
    })
  })

  it('should render when extraData defined', async () => {
    mockedOffer = {
      ...offerResponseSnap,
      extraData: {
        author: 'Dupont',
        isbn: '2-7654-1005-4',
        performer: 'Lomepal',
        speaker: 'Patrick',
        stageDirector: 'Thierry',
        visa: 'Tout public',
      },
    }
    render(<OfferDescription />)

    await waitFor(() => {
      expect(screen.getByText('Auteur')).toBeTruthy()
      expect(screen.getByText('Metteur en scène')).toBeTruthy()
      expect(screen.getByText('Interprète')).toBeTruthy()
      expect(screen.getByText('Intervenant')).toBeTruthy()
      expect(screen.getByText('ISBN')).toBeTruthy()
      expect(screen.getByText('VISA')).toBeTruthy()
    })
  })

  it('should not render when extraData not defined', async () => {
    mockedOffer = {
      ...offerResponseSnap,
      extraData: {
        author: '',
        isbn: '',
        performer: '',
        speaker: '',
        stageDirector: '',
        visa: '',
      },
    }
    render(<OfferDescription />)

    await waitFor(() => {
      expect(screen.queryByText('Auteur')).toBeNull()
      expect(screen.queryByText('Metteur en scène')).toBeNull()
      expect(screen.queryByText('Interprète')).toBeNull()
      expect(screen.queryByText('Intervenant')).toBeNull()
      expect(screen.queryByText('ISBN')).toBeNull()
      expect(screen.queryByText('VISA')).toBeNull()
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
