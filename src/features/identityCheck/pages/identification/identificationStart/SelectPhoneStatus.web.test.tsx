import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectPhoneStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectPhoneStatus.web'
import { fireEvent, render } from 'tests/utils/web'

describe('SelectPhoneStatus', () => {
  it('should render correctly', () => {
    const selectPhoneStatus = render(<SelectPhoneStatus />)
    expect(selectPhoneStatus).toMatchSnapshot()
  })

  it('should navigate to SelectIDStatus on press "J’ai un smartphone à proximité" HeroButtonList', () => {
    const { getAllByTestId } = render(<SelectPhoneStatus />)

    const HeroButtonList = getAllByTestId('HeroButtonList')[0]
    fireEvent.click(HeroButtonList)

    expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined)
  })
})
