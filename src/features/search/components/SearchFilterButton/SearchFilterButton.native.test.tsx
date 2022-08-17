import React from 'react'

import { SearchFilterButton } from 'features/search/components/SearchFilterButton/SearchFilterButton'
import { render } from 'tests/utils'
import { Check } from 'ui/svg/icons/Check'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

describe('CategoryButton', () => {
  it('should render correctly', () => {
    const searchFilterButton = render(
      <SearchFilterButton
        label="CD, vinyles, musique en ligne"
        Icon={Check}
        color={ColorsEnum.PRIMARY}
        onPress={jest.fn()}
      />
    )
    expect(searchFilterButton).toMatchSnapshot()
  })
})
