import React from 'react'

import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { CategoryBlock } from 'features/home/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

describe('CategoryListModule', () => {
  const categoryBlockList: CategoryBlock[] = [
    {
      id: '1',
      title: 'Le plein de cinéma, Le plein de cinéma, Le plein de cinéma, Le plein de cinéma',
      image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    },
    {
      id: '2',
      title: 'Toto au cinéma',
      image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    },
    {
      id: '3',
      title: 'Martine au cinéma',
      image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    },
    {
      id: '4',
      title: 'Babar au cinéma',
      image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    },
  ]
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
