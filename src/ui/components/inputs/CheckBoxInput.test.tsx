// eslint-disable-next-line import/no-unresolved
import { render } from '@testing-library/react-native'
import React from 'react'

import { ColorsEnum } from 'ui/theme'

import { CheckboxInput } from './CheckboxInput'

const NotCheckedCheckboxInput = <CheckboxInput isChecked={false} setIsChecked={doNothingFn} />
const CheckedCheckboxInput = <CheckboxInput isChecked={true} setIsChecked={doNothingFn} />

describe('<CheckboxInput />', () => {
  it('should render correctly when not checked', () => {
    const { getByTestId } = render(NotCheckedCheckboxInput)

    const renderedCheckbox = getByTestId('checkbox')
    expect(renderedCheckbox.props.style.backgroundColor).toEqual(ColorsEnum.WHITE)
  })

  it('should render correctly when checked', () => {
    const { getByTestId } = render(CheckedCheckboxInput)

    const checkboxMark = getByTestId('checkbox-mark')
    expect(checkboxMark).toBeTruthy()
  })
})

function doNothingFn() {
  /* do nothing */
}
