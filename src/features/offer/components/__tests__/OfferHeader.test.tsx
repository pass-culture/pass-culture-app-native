import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { flushAllPromises } from 'tests/utils'

import { OfferHeader } from '../OfferHeader'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

describe('<OfferHeader />', () => {
  it('should render correctly', async () => {
    const { toJSON } = await renderOfferHeader(true)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the correct icons - loggedIn', async () => {
    const offerHeader = await renderOfferHeader(true)
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeTruthy()
  })

  it('should render the correct icons - not loggedIn', async () => {
    const offerHeader = await renderOfferHeader(false)
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeNull()
  })

  it('should goBack when we press on the back buttton', async () => {
    const { getByTestId } = await renderOfferHeader(true)
    fireEvent.press(getByTestId('icon-back'))
    expect(goBack).toHaveBeenCalledTimes(1)
  })
})

async function renderOfferHeader(isLoggedIn: boolean) {
  mockUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn }))
  const wrapper = render(<OfferHeader />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}
