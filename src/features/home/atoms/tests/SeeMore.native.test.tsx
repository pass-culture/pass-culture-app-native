import React from 'react'

import { fireEvent, render } from 'tests/utils'

import { SeeMore } from '../SeeMore'

const onPress = jest.fn()
describe('SeeMore', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    const seeMore = render(<SeeMore onPress={onPress} />)
    expect(seeMore).toMatchSnapshot()
  })
  it('calls onPress when clicking the arrow', () => {
    const seeMore = render(<SeeMore onPress={onPress} />)
    fireEvent.press(seeMore.getByTestId('arrow-next'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
  it('calls onPress when clicking the text', () => {
    const seeMore = render(<SeeMore onPress={onPress} />)
    fireEvent.press(seeMore.getByText('En voir plus'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
