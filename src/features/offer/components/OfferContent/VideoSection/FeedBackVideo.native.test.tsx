import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { FeedBackVideo } from 'features/offer/components/OfferContent/VideoSection/FeedBackVideo'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

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

  it('should NOT display thank you message if reaction was stored but user did not just react', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(ReactionTypeEnum.LIKE)

    render(<FeedBackVideo offerId={offerId} />)

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(storageKey)
    })

    expect(
      screen.queryByText('Merci pour ta réponse ! As-tu 2 minutes pour nous dire pourquoi ?')
    ).toBeNull()
  })

  it('should display thank you message right after user reacts', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} />)

    const thumbUp = await screen.findByTestId('thumbUp')
    await user.press(thumbUp)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(storageKey, ReactionTypeEnum.LIKE)
  })

  it('should store the LIKE reaction when user clicks on Oui', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} />)

    const yesButton = await screen.findByText('Oui')
    await user.press(yesButton)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
      'feedback_reaction_123',
      ReactionTypeEnum.LIKE
    )
  })

  it('should store the DISLIKE reaction when user clicks on Non', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} />)

    const noButton = await screen.findByText('Non')
    await user.press(noButton)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
      'feedback_reaction_123',
      ReactionTypeEnum.DISLIKE
    )
  })
})
