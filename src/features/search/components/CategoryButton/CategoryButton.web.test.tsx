import React from 'react'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { CategoryButton } from './CategoryButton'

describe('<Checkbox />', () => {
  it('should render an accessible CategoryButton', async () => {
    const { container } = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor="#870087"
        onPress={jest.fn()}
        gradients={[
          { color: '#EC3478', position: { x: 0, y: 0 } },
          { color: '#C01371', position: { x: 0, y: 0.5 } },
        ]}
      />
    )
    const results = await checkAccessibilityFor(container)
    expect(results).toHaveNoViolations()
  })
})
