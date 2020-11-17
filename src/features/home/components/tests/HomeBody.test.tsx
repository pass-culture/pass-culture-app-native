import { render } from '@testing-library/react-native'
import React from 'react'

import { adaptedHomepageEntries } from 'tests/fixtures/homepageEntries'

import { BusinessFields, BusinessPane, processHomepageEntries } from '../../contentful'
import { HomeBody } from '../HomeBody'

const businessModules = adaptedHomepageEntries.fields.modules
  .filter((m) => 'targetNotConnectedUsersOnly' in m.fields)
  .map((m) => m.fields) as BusinessFields[]

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const connected = businessModules.find((m) => m.targetNotConnectedUsersOnly === false)!
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const notConnected = businessModules.find((m) => m.targetNotConnectedUsersOnly === true)!
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const targetingBoth = businessModules.find((m) => m.targetNotConnectedUsersOnly === undefined)!

describe('HomeBody component', () => {
  it('should render', async () => {
    const home = await renderHomeBody(true)
    expect(home.toJSON()).toMatchSnapshot()
  })

  it('Business Module targeting connected users', async () => {
    // Given user is connected
    const home = await renderHomeBody(true)

    // Then
    expect(home.getAllByTestId('firstLine').map((el) => el.children)).toEqual([
      [targetingBoth.firstLine],
      [connected.firstLine],
    ])
  })

  it('Business Module targeting NON connected users', async () => {
    // Given user is not connected
    const home = await renderHomeBody(false)

    // Then
    expect(home.getAllByTestId('firstLine').map((el) => el.children)).toEqual([
      [targetingBoth.firstLine],
      [notConnected.firstLine],
    ])
  })
})

async function renderHomeBody(connected: boolean) {
  return render(
    <HomeBody
      modules={processHomepageEntries(adaptedHomepageEntries).filter(
        (m) => m instanceof BusinessPane
      )}
      connected={connected}
      position={null}
    />
  )
}
