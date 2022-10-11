import { NavigationContainer } from '@react-navigation/native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { OfferResponse } from 'api/gen'
import { RootStack } from 'features/navigation/RootNavigator/Stack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import { ParsedDescription } from 'libs/parsers/highlightLinks'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct, render } from 'tests/utils'

import {
  OfferDescription,
  ExtendedKeys,
  formatValue,
  getContentFromOffer,
} from './OfferDescription'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('@react-navigation/stack', () => jest.requireActual('@react-navigation/stack'))

describe('<OfferDescription />', () => {
  it('should render', async () => {
    const { toJSON, queryByText, getByText } = await renderOfferDescription()
    expect(toJSON()).toMatchSnapshot()

    await waitForExpect(() => {
      expect(getByText('En détails')).toBeTruthy()
      expect(queryByText('Durée')).toBeNull()
    })
  })

  it('should render without description', async () => {
    const { queryByText, getByText } = await renderOfferDescription({
      extraData: { durationMinutes: 20 },
      description: '',
    })

    await waitForExpect(() => {
      expect(getByText('Durée')).toBeTruthy()
      expect(getByText('Author: photo credit author')).toBeTruthy()
      expect(queryByText('En détails')).toBeNull()
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

async function renderOfferDescription(
  extraOffer?: Pick<OfferResponse, 'extraData' | 'description'>
) {
  const offerId = 116656

  server.use(
    rest.get<OfferResponse>(env.API_BASE_URL + `/native/v1/offer/${offerId}`, (req, res, ctx) =>
      res.once(ctx.status(200), ctx.json({ ...offerResponseSnap, ...extraOffer }))
    )
  )

  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
  await superFlushWithAct()
  await waitForExpect(() => {
    expect(wrapper.queryByTestId('offer-description-list')).toBeTruthy()
  })
  return wrapper
}
