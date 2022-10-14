// eslint-disable-next-line import/no-unresolved
import React from 'react'

import { render } from 'tests/utils'
import { theme } from 'theme'

import { CheckboxInput } from './CheckboxInput'

const NotCheckedCheckboxInput = <CheckboxInput isChecked={false} />
const CheckedCheckboxInput = <CheckboxInput isChecked />

describe('<CheckboxInput />', () => {
  it('should render correctly when not checked', () => {
    const { getByTestId } = render(NotCheckedCheckboxInput)

    const renderedCheckbox = getByTestId('checkbox')
    expect(renderedCheckbox.props.style[0].backgroundColor).toEqual(theme.colors.white)
  })

  it('should render correctly when checked', () => {
    const { getByTestId } = render(CheckedCheckboxInput)

    const checkboxMark = getByTestId('checkbox-mark')
    expect(checkboxMark).toBeTruthy()
  })
})
