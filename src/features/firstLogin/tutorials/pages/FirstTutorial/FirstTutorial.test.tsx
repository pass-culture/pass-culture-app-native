import { render } from '@testing-library/react-native'
import React from 'react'

import { FirstTutorial } from 'features/firstLogin/tutorials/pages/FirstTutorial/FirstTutorial'

describe('FirstTutorial page', () => {
  it('should render first tutorial', async () => {
    const firstTutorial = render(<FirstTutorial />)
    expect(firstTutorial).toMatchSnapshot()
  })
})
