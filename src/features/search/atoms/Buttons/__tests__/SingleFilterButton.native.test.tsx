import React from 'react'

import { SingleFilterButton } from 'features/search/atoms/Buttons/FilterButton/SingleFilterButton'
import { render } from 'tests/utils'
import { theme } from 'theme'
import { Check } from 'ui/svg/icons/Check'

describe('SingleFilterButton', () => {
  it('should render correctly', () => {
    const singleFilterButton = render(
      <SingleFilterButton
        label="CD, vinyles, musique en ligne"
        Icon={Check}
        color={theme.colors.primary}
        onPress={jest.fn()}
      />
    )
    expect(singleFilterButton).toMatchSnapshot()
  })
})
