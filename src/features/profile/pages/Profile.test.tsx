import { render, act } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { flushAllPromises } from 'tests/utils'

import { Profile } from './Profile'

async function renderProfile() {
  const wrapper = render(<Profile />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

describe('Profile component', () => {
  it('should navigate when the personal data row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-personal-data')
    row.props.onClick()

    // TODO: PC-
    expect(navigate).toBeCalledWith('TemporyProfilePage')
  })
  it('should navigate when the password row is clicked', async () => {
    const { getByTestId } = await renderProfile()

    const row = getByTestId('row-password')
    row.props.onClick()

    // TODO: PC-
    expect(navigate).toBeCalledWith('TemporyProfilePage')
  })
})
