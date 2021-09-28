import React from 'react'

import { render } from 'tests/utils'

import { DateInput, DateInputRef } from './DateInput'

describe('DateInput Component', () => {
  it('should render ref and give access to clearFocuses function', () => {
    // given
    const myRef = React.createRef<DateInputRef>()
    render(<DateInput ref={myRef} />)

    expect(myRef.current).toBeTruthy()
    expect(myRef.current && myRef.current.clearFocuses).toBeTruthy()
  })
})
