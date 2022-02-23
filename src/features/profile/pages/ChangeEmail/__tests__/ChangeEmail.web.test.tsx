import React from 'react'

import { render } from 'tests/utils/web'

import { ChangeEmail } from '../ChangeEmail'

// TODO why is onPress props passed through web button?
// it creates "Warning: Unknown event handler property `%s`. It will be ignored.%s", "onPress" error
// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('react-query')

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI).toMatchSnapshot()
  })
})
