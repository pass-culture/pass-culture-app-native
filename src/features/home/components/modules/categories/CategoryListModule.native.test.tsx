import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { act, fireEvent, render, screen } from 'tests/utils'

describe('CategoryListModule', () => {
  describe('with FF enableAppV2CategoryBlock false', () => {
    beforeEach(() => setFeatureFlags())

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

    it('should call analytics when a categoryBlock is clicked', () => {
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

      fireEvent.press(bloc)

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

      await act(async () => {
        fireEvent.press(bloc)
      })

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
  })
})
