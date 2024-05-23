import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, fireEvent, render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('CategoryListModule', () => {
  beforeEach(() => useFeatureFlagSpy.mockReturnValue(false))

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

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith(
      '123',
      ContentTypes.CATEGORY_LIST,
      1,
      'homeEntryId'
    )
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

    const bloc = screen.getByText('Toto au cinéma')

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

    const bloc = screen.getByText('Toto au cinéma')

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

  it('should render properly when enableAppV2CategoryBlock FF is activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true).mockReturnValueOnce(true)

    render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="homeEntryId"
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should display circle nav buttons when feature is enabled', () => {
    useFeatureFlagSpy.mockReturnValue(true).mockReturnValueOnce(true)

    render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      />
    )

    expect(screen.getByText('Ce week-end')).toBeOnTheScreen()
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
