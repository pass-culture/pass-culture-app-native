import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { FeedBackVideo } from 'features/offer/components/OfferContent/VideoSection/FeedBackVideo'
import { render, screen, userEvent, waitFor } from 'tests/utils'

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

    await waitFor(() => {
      expect(screen.getByText('Trouves-tu le contenu de cette vidéo utile ?')).toBeTruthy()
    })
  })

  it('should display thank you message when LIKE reaction is stored', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(ReactionTypeEnum.LIKE)

    render(<FeedBackVideo offerId={offerId} />)

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(storageKey)
      expect(
        screen.getByText('Merci pour ta réponse ! As-tu 2 minutes pour nous dire pourquoi ?')
      ).toBeTruthy()
    })
  })

  it('should store the reaction when user clicks a button', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} />)

    const thumbUp = await screen.findByTestId('thumbUp')
    user.press(thumbUp)

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(storageKey, ReactionTypeEnum.LIKE)
    })
  })
})
