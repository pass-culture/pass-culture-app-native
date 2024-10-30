import React from 'react'

import { render } from 'tests/utils'
import { ImagesCarouselModal } from 'ui/components/ImagesCarouselModal/ImagesCarouselModal'

describe('ImagesCarouselModal', () => {
  it('should return null on native side', () => {
    const { root } = render(<ImagesCarouselModal imagesURL={[]} hideModal={jest.fn()} />)

    expect(root).toBeUndefined()
  })
})
