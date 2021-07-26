import React from 'react'
import { Text } from 'react-native'

import { Link } from '../Link'

describe('Link enhanced', () => {
  it('should match snapshot', () => {
    expect(
      <Link
        to={'/cgu'}
        params={{
          email: 'test@test.com',
          isNewsletterChecked: true,
          password: 'user@AZERTY123',
          birthday: '01/01/2003',
          postalCode: '93000',
        }}>
        <Text>Linktest</Text>
      </Link>
    ).toMatchSnapshot()
  })
})
