import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { SeeMore } from '../SeeMore'

const onPress = jest.fn()
describe('SeeMore', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    const seeMore = render(<SeeMore />)
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
