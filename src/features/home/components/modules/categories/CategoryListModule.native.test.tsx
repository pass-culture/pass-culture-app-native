import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

const user = userEvent.setup()
jest.useFakeTimers()

describe('CategoryListModule', () => {
  beforeAll(() => setFeatureFlags())

  it('should call analytics when the module is displayed', () => {
    render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="homeEntryId"
      />
    )

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: '123',
      moduleType: ContentTypes.CATEGORY_LIST,
      index: 1,
      homeEntryId: 'homeEntryId',
    })
  })

  it('should call analytics when a categoryBlock is clicked', async () => {
    render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="homeEntryId"
      />
    )

    const bloc = screen.getByText('Toto au cinéma'.toUpperCase())

    await user.press(bloc)

    expect(analytics.logCategoryBlockClicked).toHaveBeenCalledWith({
      moduleId: '2',
      moduleListID: '123',
      entryId: 'homeEntryId',
      toEntryId: '6DCThxvbPFKAo04SVRZtwY',
    })
  })

  it('should navigate to thematic home when a categoryBlock is clicked', async () => {
    render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      />
    )

    const bloc = screen.getByText('Toto au cinéma'.toUpperCase())

    await user.press(bloc)

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: '6DCThxvbPFKAo04SVRZtwY',
      from: 'category_block',
      moduleId: '2',
      moduleListId: '123',
    })
  })

  it('should NOT display circle nav buttons when feature is disabled', () => {
    render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      />
    )

    expect(screen.queryByText('Ce week-end')).not.toBeOnTheScreen()
  })

  it('should not display home satisfaction qualtrics banner when enableHomeSatisfactionQualtrics FF disabled', () => {
    render(
      <CategoryListModule
        id="123"
        title="Explore les catégories"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      />
    )

    expect(
      screen.queryByText(
        'Un avis sur cette page ? Partage-nous tes idées pour nous aider à l’améliorer !'
      )
    ).not.toBeOnTheScreen()
  })

  describe('When enableHomeSatisfactionQualtrics FF enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_HOME_SATISFACTION_QUALTRICS])
    })

    it('should display home satisfaction qualtrics banner if not already pressed', () => {
      asyncStorageSpyOn.mockResolvedValueOnce(null)

      render(
        <CategoryListModule
          id="123"
          title="Explore les catégories"
          categoryBlockList={categoryBlockList}
          index={1}
          homeEntryId="6DCThxvbPFKAo04SVRZtwY"
        />
      )

      expect(
        screen.getByText(
          'Un avis sur cette page ? Partage-nous tes idées pour nous aider à l’améliorer !'
        )
      ).toBeOnTheScreen()
    })

    it('should not display home satisfaction qualtrics banner if already pressed', async () => {
      asyncStorageSpyOn.mockResolvedValueOnce('pressed')

      render(
        <CategoryListModule
          id="123"
          title="Explore les catégories"
          categoryBlockList={categoryBlockList}
          index={1}
          homeEntryId="6DCThxvbPFKAo04SVRZtwY"
        />
      )

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('home_satisfaction_qualtrics_pressed')
      })

      expect(
        screen.queryByText(
          'Un avis sur cette page ? Partage-nous tes idées pour nous aider à l’améliorer !'
        )
      ).not.toBeOnTheScreen()
    })

    it('should store home satisfaction qualtrics banner press when user press "Répondre au court questionnaire" button', async () => {
      asyncStorageSpyOn.mockResolvedValueOnce(null)

      render(
        <CategoryListModule
          id="123"
          title="Explore les catégories"
          categoryBlockList={categoryBlockList}
          index={1}
          homeEntryId="6DCThxvbPFKAo04SVRZtwY"
        />
      )

      await user.press(screen.getByText('Répondre au court questionnaire'))

      expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
        'home_satisfaction_qualtrics_pressed',
        'pressed'
      )
    })
  })
})
