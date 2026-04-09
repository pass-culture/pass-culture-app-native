import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { FeedBack } from 'features/reactions/components/FeedBack'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

const thanksMessage = 'Merci pour ta réponse ! As-tu 2 minutes pour nous dire pourquoi ?'
const buttonsLabels = { like: 'Oui', dislike: 'Non' }

describe('<FeedBack />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display feedback question when no reaction is stored', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(
      <FeedBack
        storageKey="storageKey"
        likeQuiz="likeQuiz"
        dislikeQuiz="dislikeQuiz"
        title="Trouves-tu ce contenu intéressant ?"
        onLogReaction={jest.fn()}
      />
    )

    expect(await screen.findByText('Trouves-tu ce contenu intéressant ?')).toBeTruthy()
  })

  it('should not show thank you message when reaction is restored without recent interaction', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(ReactionTypeEnum.LIKE)

    render(
      <FeedBack
        storageKey="storageKey"
        likeQuiz="likeQuiz"
        dislikeQuiz="dislikeQuiz"
        title="Trouves-tu ce contenu intéressant ?"
        onLogReaction={jest.fn()}
        thanksMessage={thanksMessage}
      />
    )

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('storageKey')
    })

    expect(screen.queryByText(thanksMessage)).toBeNull()
  })

  it('should store the LIKE reaction when user clicks on like button', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(
      <FeedBack
        storageKey="storageKey"
        likeQuiz="likeQuiz"
        dislikeQuiz="dislikeQuiz"
        title="Trouves-tu ce contenu intéressant ?"
        buttonsLabels={buttonsLabels}
        onLogReaction={jest.fn()}
      />
    )

    const likeButton = await screen.findByText(buttonsLabels.like)
    await user.press(likeButton)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith('storageKey', ReactionTypeEnum.LIKE)
  })

  it('should store the DISLIKE reaction when user clicks on dislike button', async () => {
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(
      <FeedBack
        storageKey="storageKey"
        likeQuiz="likeQuiz"
        dislikeQuiz="dislikeQuiz"
        title="Trouves-tu ce contenu intéressant ?"
        buttonsLabels={buttonsLabels}
        onLogReaction={jest.fn()}
      />
    )

    const dislikeButton = await screen.findByText(buttonsLabels.dislike)
    await user.press(dislikeButton)

    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith('storageKey', ReactionTypeEnum.DISLIKE)
  })

  it('should trigger reaction log when user clicks on a reaction', async () => {
    const mockOnLogReaction = jest.fn()
    asyncStorageSpyOn.mockResolvedValueOnce(null)

    render(
      <FeedBack
        storageKey="storageKey"
        likeQuiz="likeQuiz"
        dislikeQuiz="dislikeQuiz"
        title="Trouves-tu ce contenu intéressant ?"
        buttonsLabels={buttonsLabels}
        onLogReaction={mockOnLogReaction}
      />
    )

    const likeButton = await screen.findByText(buttonsLabels.like)
    await user.press(likeButton)

    expect(mockOnLogReaction).toHaveBeenCalledWith(ReactionTypeEnum.LIKE)
  })
})
