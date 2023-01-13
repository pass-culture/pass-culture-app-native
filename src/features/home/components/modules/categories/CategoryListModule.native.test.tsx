import React from 'react'

import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

describe('CategoryListModule', () => {
  it('should call analytics when a categoryBlock is clicked', () => {
    const categoryListModule = render(
      <CategoryListModule id="123" title="module" categoryBlockList={categoryBlockList} />
    )

    const bloc = categoryListModule.getByText('Toto au cinéma')

    fireEvent.press(bloc)

    expect(analytics.logCategoryBlockClicked).toHaveBeenCalledWith({
      moduleID: '2',
      moduleListID: '123',
      toEntryId: '6DCThxvbPFKAo04SVRZtwY',
    })
  })
})
