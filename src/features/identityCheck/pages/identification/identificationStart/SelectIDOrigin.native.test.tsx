import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))
describe('SelectIDOrigin', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SelectIDOrigin />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to SelectIDStatus on press french HeroButtonList', () => {
    const { getAllByTestId } = render(<SelectIDOrigin />)

    const HeroButtonListFrench = getAllByTestId('HeroButtonList')[0]
    fireEvent.press(HeroButtonListFrench)

    expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined)
  })

  it('should navigate to DMSIntroduction with foreign parameter on press foreign HeroButtonList', () => {
    const { getAllByTestId } = render(<SelectIDOrigin />)

    const HeroButtonListForeign = getAllByTestId('HeroButtonList')[1]
    fireEvent.press(HeroButtonListForeign)

    expect(navigate).toHaveBeenCalledWith('DMSIntroduction', { isForeignDMSInformation: true })
  })
})
