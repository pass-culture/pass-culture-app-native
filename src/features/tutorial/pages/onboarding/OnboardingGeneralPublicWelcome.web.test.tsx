import React from 'react'

import { render } from 'tests/utils/web'

import { OnboardingGeneralPublicWelcome } from './OnboardingGeneralPublicWelcome'

describe('OnboardingGeneralPublicWelcome', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingGeneralPublicWelcome />)

    expect(container).toBeEmptyDOMElement()
  })
})
