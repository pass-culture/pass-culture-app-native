import AsyncStorage from '@react-native-community/async-storage'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { FirstTutorial } from './FirstTutorial'

describe('FirstTutorial page', () => {
  it('should render first tutorial', () => {
    const firstTutorial = render(<FirstTutorial />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should set has_seen_tutorials in storage on skip', () => {
    const { getByText } = render(<FirstTutorial />)
    fireEvent.press(getByText('Tout passer'))
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })
})
