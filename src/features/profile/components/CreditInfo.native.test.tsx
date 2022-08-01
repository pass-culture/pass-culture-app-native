import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { render } from 'tests/utils'

import { CreditInfo } from './CreditInfo'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const totalCredit = beneficiaryUser.domainsCredit!.all
describe('<CreditInfo />', () => {
  it('should render properly', () => {
    const renderAPI = render(<CreditInfo totalCredit={totalCredit} />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should display remaining credit', () => {
    const { queryByText } = render(<CreditInfo totalCredit={totalCredit} />)

    const remainingCredit = formatToFrenchDecimal(totalCredit.remaining)
    expect(queryByText(remainingCredit)).toBeTruthy()
  })

  it('should have the right length', () => {
    const expectedProgress = totalCredit.remaining / totalCredit.initial
    const { getByTestId } = render(<CreditInfo totalCredit={totalCredit} />)

    const progressBar = getByTestId('progress-bar')
    const style = progressBar.props.style[0]
    expect(style.flexGrow).toEqual(expectedProgress)
  })
})
