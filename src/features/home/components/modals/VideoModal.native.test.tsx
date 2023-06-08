import React from 'react'

import { VideoModal } from 'features/home/components/modals/VideoModal'
import { render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

describe('VideoModal', () => {
  it('should render correctly if modal visible', () => {
    render(<VideoModal visible hideModal={hideModalMock} />)

    expect(screen).toMatchSnapshot()
  })
})
