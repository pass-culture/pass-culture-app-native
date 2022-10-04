import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import { render } from 'tests/utils'

describe('DMSIntroduction', () => {
  it('should render french version correctly', () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: false,
      },
    })
    const DMSIntroductionFR = render(<DMSIntroduction />)
    expect(DMSIntroductionFR).toMatchSnapshot()
  })

  it('should render foreign version correctly', () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: true,
      },
    })
    const DMSIntroductionFR = render(<DMSIntroduction />)
    expect(DMSIntroductionFR).toMatchSnapshot()
  })
})
