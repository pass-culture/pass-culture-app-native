import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { ReactionTypeEnum, SubcategoryIdEnum } from 'api/gen'
import { FeedBackVideo } from 'features/offer/components/OfferContent/VideoSection/FeedBackVideo'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

describe('<FeedBackVideo />', () => {
  const offerId = 123
  const offerSubcategory = SubcategoryIdEnum.SEANCE_CINE
  const storageKey = `feedback_reaction_${offerId}`

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display feedback question when no reaction is stored', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} />)

    expect(await screen.findByText('Trouves-tu le contenu de cette vidéo utile ?')).toBeTruthy()
  })

  it('should not show thank you message when reaction is restored without recent interaction', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(ReactionTypeEnum.LIKE)

    render(<FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} />)

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(storageKey)
    })

    expect(
      screen.queryByText('Merci pour ta réponse ! As-tu 2 minutes pour nous dire pourquoi ?')
    ).toBeNull()
  })

  it('should show thank you message immediately after user selects a reaction', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} />)

    const thumbUp = await screen.findByTestId('thumbUp')
    await user.press(thumbUp)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(storageKey, ReactionTypeEnum.LIKE)
  })

  it('should store the LIKE reaction when user clicks on Oui', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} />)

    const yesButton = await screen.findByText('Oui')
    await user.press(yesButton)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
      'feedback_reaction_123',
      ReactionTypeEnum.LIKE
    )
  })

  it('should store the DISLIKE reaction when user clicks on Non', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(<FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} />)

    const noButton = await screen.findByText('Non')
    await user.press(noButton)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
      'feedback_reaction_123',
      ReactionTypeEnum.DISLIKE
    )
  })
})
