import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { OfferResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { ParsedDescription } from 'libs/parsers/highlightLinks'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { offerResponseSnap } from '../api/snaps/offerResponseSnap'
import { dehumanizeId } from '../services/dehumanizeId'

import {
  OfferDescription,
  ExtendedKeys,
  formatValue,
  getContentFromOffer,
} from './OfferDescription'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<OfferDescription />', () => {
  it('should render', async () => {
    const { toJSON, queryByText } = await renderOfferDescription()
    expect(toJSON()).toMatchSnapshot()
    expect(queryByText('En détail')).toBeTruthy()
    expect(queryByText('Durée')).toBeFalsy()
  })
  it('should render without description', async () => {
    const { queryByText } = await renderOfferDescription({
      extraData: { durationMinutes: 20 },
      description: '',
    })
    expect(queryByText('En détail')).toBeFalsy()
    expect(queryByText('Durée')).toBeTruthy()
    expect(queryByText('Author: photo credit author')).toBeTruthy()
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
    expect(getField(getContentFromOffer({}, 'link http://link.com'), 'description')).toEqual([
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

async function renderOfferDescription(
  extraOffer?: Pick<OfferResponse, 'extraData' | 'description'>
) {
  const humanizedOfferId = 'AHD3A'
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const offerId = dehumanizeId(humanizedOfferId)!

  server.use(
    rest.get<OfferResponse>(env.API_BASE_URL + `/native/v1/offer/${offerId}`, (req, res, ctx) =>
      res.once(ctx.status(200), ctx.json({ ...offerResponseSnap, ...extraOffer }))
    )
  )

  const wrapper = render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Offer">
          <RootStack.Screen
            name="OfferDescription"
            component={OfferDescription}
            initialParams={{ id: offerId }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  )

  await act(async () => {
    await flushAllPromises()
  })

  await waitForExpect(() => {
    expect(wrapper.queryByTestId('offer-description-list')).toBeTruthy()
  })

  return wrapper
}
