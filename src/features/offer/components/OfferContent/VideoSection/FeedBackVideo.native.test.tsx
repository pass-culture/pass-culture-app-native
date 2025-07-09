import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { FeedBackVideo } from 'features/offer/components/OfferContent/VideoSection/FeedBackVideo'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')

describe('<FeedBackVideo />', () => {
  const offerId = 123
  const storageKey = `feedback_reaction_${offerId}`

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display feedback question when no reaction is stored', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} />)

    expect(await screen.findByText('Trouves-tu le contenu de cette vidéo utile ?')).toBeTruthy()
  })

  it('should display thank you message when LIKE reaction is stored', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(ReactionTypeEnum.LIKE)

    render(<FeedBackVideo offerId={offerId} />)

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(storageKey)

    expect(
      await screen.findByText('Merci pour ta réponse ! As-tu 2 minutes pour nous dire pourquoi ?')
    ).toBeTruthy()
  })

  it('should store the reaction when user clicks a button', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} />)

    const thumbUp = await screen.findByTestId('thumbUp')
    await user.press(thumbUp)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(storageKey, ReactionTypeEnum.LIKE)
  })
})
