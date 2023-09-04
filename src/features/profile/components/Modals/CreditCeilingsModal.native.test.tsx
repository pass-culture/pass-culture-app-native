import React from 'react'

import { CreditCeilingsModal } from 'features/profile/components/Modals/CreditCeilingsModal'
import { beneficiaryUser } from 'fixtures/user'
import { fireEvent, render } from 'tests/utils'

const hideModalMock = jest.fn()

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const domainsCreditWithPhysicalCeiling = beneficiaryUser.domainsCredit!
const domainsCreditWithoutPhysicalCeiling = { ...beneficiaryUser.domainsCredit!, physical: null }

describe('<CreditCeilingsModal/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(
      <CreditCeilingsModal
        domainsCredit={domainsCreditWithoutPhysicalCeiling}
        visible
        hideModal={hideModalMock}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display nothing if modal is not visible', () => {
    const renderAPI = render(
      <CreditCeilingsModal
        domainsCredit={domainsCreditWithoutPhysicalCeiling}
        visible={false}
        hideModal={hideModalMock}
      />
    )
    expect(renderAPI.toJSON()).not.toBeOnTheScreen()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(
      <CreditCeilingsModal
        domainsCredit={domainsCreditWithoutPhysicalCeiling}
        visible
        hideModal={hideModalMock}
      />
    )
    const rightIcon = getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should display text without physical ceiling if no physical ceiling', () => {
    const { queryByTestId } = render(
      <CreditCeilingsModal
        domainsCredit={domainsCreditWithoutPhysicalCeiling}
        visible
        hideModal={hideModalMock}
      />
    )
    expect(queryByTestId('creditText')).toBeOnTheScreen()
    expect(queryByTestId('creditTextWithPhysicalCeiling')).not.toBeOnTheScreen()
  })

  it('should display text with physical ceiling if it exists', () => {
    const { queryByTestId } = render(
      <CreditCeilingsModal
        domainsCredit={domainsCreditWithPhysicalCeiling}
        visible
        hideModal={hideModalMock}
      />
    )
    expect(queryByTestId('creditText')).not.toBeOnTheScreen()
    expect(queryByTestId('creditTextWithPhysicalCeiling')).toBeOnTheScreen()
  })
})
