// eslint-disable-next-line import/no-unresolved
import React from 'react'

import { render } from 'tests/utils/web'
import { ColorsEnum } from 'ui/theme'

import { CheckboxInput } from './CheckboxInput'

const NotCheckedCheckboxInput = <CheckboxInput isChecked={false} setIsChecked={doNothingFn} />
const CheckedCheckboxInput = <CheckboxInput isChecked={true} setIsChecked={doNothingFn} />

describe('<CheckboxInput />', () => {
  it('should render correctly when not checked', () => {
    const renderAPI = render(NotCheckedCheckboxInput)

    const renderedCheckbox = renderAPI.getByTestId('checkbox')
    expect(renderedCheckbox.style.backgroundColor).toEqual('rgb(255, 255, 255)')
  })

  it('should render correctly when checked', () => {
    const renderAPI = render(CheckedCheckboxInput)

    const checkboxMark = renderAPI.getByTestId('checkbox-mark')
    expect(checkboxMark).toBeTruthy()
  })
})

function doNothingFn() {
  /* do nothing */
}
