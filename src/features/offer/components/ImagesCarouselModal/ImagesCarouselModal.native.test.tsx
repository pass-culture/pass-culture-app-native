import React from 'react'

import { ImagesCarouselModal } from 'features/offer/components/ImagesCarouselModal/ImagesCarouselModal'
import { render } from 'tests/utils'

describe('ImagesCarouselModal', () => {
  it('should return null on native side', () => {
    const { root } = render(<ImagesCarouselModal imagesURL={[]} hideModal={jest.fn()} />)

    expect(root).toBeUndefined()
  })
})
