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

  it('should display an icon when specified', () => {
    const { getByTestId } = render(
      <SingleFilterButton label="CD, vinyles, musique en ligne" Icon={Check} onPress={jest.fn()} />
    )

    expect(getByTestId('filterButtonIcon')).toBeTruthy()
  })

  it('should use the color in the label when specified', () => {
    const { getByTestId } = render(
      <SingleFilterButton
        label="CD, vinyles, musique en ligne"
        color={theme.colors.primary}
        onPress={jest.fn()}
      />
    )

    expect(getByTestId('filterButtonLabel')).toHaveStyle({ color: theme.colors.primary })
  })

  it('should use the color in the border of the button when specified', () => {
    const { getByTestId } = render(
      <SingleFilterButton
        label="CD, vinyles, musique en ligne"
        color={theme.colors.primary}
        onPress={jest.fn()}
        testID="filterButton"
      />
    )

    expect(getByTestId('filterButton')).toHaveStyle({ borderColor: theme.colors.primary })
  })
})
