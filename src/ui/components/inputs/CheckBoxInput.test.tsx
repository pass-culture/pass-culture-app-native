import { render } from '@testing-library/react-native'
import React from 'react'

import { CheckBoxInput } from 'ui/components/inputs/CheckBoxInput'

const NotCheckedCheckBoxInput = <CheckBoxInput isChecked={false} setIsChecked={doNothingFn} />
const CheckedCheckBoxInput = <CheckBoxInput isChecked={false} setIsChecked={doNothingFn} />

describe('<CheckBoxInput />', () => {
  it('should render correctly when not checked', () => {
    const instance = render(NotCheckedCheckBoxInput)

    expect(instance).toMatchSnapshot()
  })

  it('should render correctly when checked', () => {
    const notCheckedInstance = render(NotCheckedCheckBoxInput)
    const checkedInstance = render(CheckedCheckBoxInput)

    expect(notCheckedInstance).toMatchDiffSnapshot(checkedInstance)
  })
})

function doNothingFn() {
  /* do nothing */
}
