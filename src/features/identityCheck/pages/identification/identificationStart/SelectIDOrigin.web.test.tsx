import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin.web'
import { fireEvent, render } from 'tests/utils/web'

describe('selectIDOrigin', () => {
  it('should render correctly', () => {
    const selectIDOrigin = render(<SelectIDOrigin />)

    expect(selectIDOrigin).toMatchSnapshot()
  })

  it('should navigate to SelectPhoneStatus on press "J’ai une carte d’identité ou un passeport" HeroButtonList', () => {
    const { getAllByTestId } = render(<SelectIDOrigin />)

    const HeroButtonList = getAllByTestId('HeroButtonList')[0]
    fireEvent.click(HeroButtonList)

    expect(navigate).toHaveBeenCalledWith('SelectPhoneStatus', undefined)
  })
})
