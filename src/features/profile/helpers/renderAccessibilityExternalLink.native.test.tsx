import { renderAccessibilityExternalLink } from 'features/profile/helpers/renderAccessibilityExternalLink'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('renderAccessibilityExternalLink', () => {
  it('should render an ExternalTouchableLink with the correct url and wording', () => {
    const url = 'https://pass.culture.fr/'
    render(renderAccessibilityExternalLink(url))

    expect(screen.getByText(url)).toBeTruthy()
  })
})
