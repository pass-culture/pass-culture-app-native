import React from 'react'

import { SearchCategoriesIllustrations } from 'features/search/enums'
import { checkAccessibilityFor, render } from 'tests/utils/web'
import { theme } from 'theme'

import { CategoryButton } from './CategoryButton'

describe('<Checkbox />', () => {
  it('should render an accessible CategoryButton', async () => {
    const { container } = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor="#870087"
        onPress={jest.fn()}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
