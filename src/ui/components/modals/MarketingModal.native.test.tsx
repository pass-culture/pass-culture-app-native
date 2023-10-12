import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { MarketingModal } from './MarketingModal'

const props = {
  visible: true,
  title: 'Titre',
  imageSource: { uri: '' },
  onBackdropPress: jest.fn(),
}

describe('MarketingModal', () => {
  it('should render correctly', () => {
    const renderAPI = render(<MarketingModal {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call onBackdropPress when clicking outside modal', async () => {
    render(<MarketingModal {...props} />)
    const clickAwayArea = screen.getByTestId('clickaway-area')
    fireEvent.press(clickAwayArea)
    expect(props.onBackdropPress).toHaveBeenCalledTimes(1)
  })
})
