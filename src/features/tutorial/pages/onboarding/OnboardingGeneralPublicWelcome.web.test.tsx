import React from 'react'

import { render } from 'tests/utils/web'

import { OnboardingGeneralPublicWelcome } from './OnboardingGeneralPublicWelcome'

jest.mock('libs/firebase/analytics/analytics')

describe('OnboardingGeneralPublicWelcome', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingGeneralPublicWelcome />)

    expect(container).toBeEmptyDOMElement()
  })
})
