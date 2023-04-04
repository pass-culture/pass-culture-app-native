import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, flushAllPromisesWithAct, render } from 'tests/utils'

describe('CategoryListModule', () => {
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
    const categoryListModule = render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="homeEntryId"
      />
    )

    const bloc = categoryListModule.getByText('Toto au cinéma')

    fireEvent.press(bloc)

    expect(analytics.logCategoryBlockClicked).toHaveBeenCalledWith({
      moduleId: '2',
      moduleListID: '123',
      entryId: 'homeEntryId',
      toEntryId: '6DCThxvbPFKAo04SVRZtwY',
    })
  })

  it('should navigate to thematic home when a categoryBlock is clicked', async () => {
    const categoryListModule = render(
      <CategoryListModule
        id="123"
        title="module"
        categoryBlockList={categoryBlockList}
        index={1}
        homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      />
    )

    const bloc = categoryListModule.getByText('Toto au cinéma')

    fireEvent.press(bloc)
    await flushAllPromisesWithAct()

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: '6DCThxvbPFKAo04SVRZtwY',
      from: 'category_block',
      moduleId: '2',
      moduleListId: '123',
    })
  })
})
