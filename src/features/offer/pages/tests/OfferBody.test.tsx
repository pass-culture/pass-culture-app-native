import mockdate from 'mockdate'

import { renderOfferBodyPage } from './renderOfferPageTestUtil'

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })

  it('should match snapshot for physical offer', async () => {
    const { toJSON } = await renderOfferBodyPage({ isDigital: false })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should match snapshot for digital offer', async () => {
    const { toJSON } = await renderOfferBodyPage({ isDigital: true, isDuo: false })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show accessibilityDetails', async () => {
    let wrapper = await renderOfferBodyPage()
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferBodyPage({ accessibility: { visualDisability: false } })
    expect(wrapper.queryByText('Accessibilité')).toBeTruthy()

    wrapper = await renderOfferBodyPage({ accessibility: {} })
    expect(wrapper.queryByText('Accessibilité')).toBeFalsy()
  })

  it('should show withdrawalDetails', async () => {
    const wrapper = await renderOfferBodyPage({ withdrawalDetails: 'How to withdraw' })
    expect(wrapper.queryByText('Modalités de retrait')).toBeTruthy()
  })

  it('should not show withdrawalDetails', async () => {
    const wrapper = await renderOfferBodyPage({ withdrawalDetails: undefined })
    expect(wrapper.queryByText('Modalités de retrait')).toBeFalsy()
  })

  it('should not show distance and go to button', async () => {
    const wrapper = await renderOfferBodyPage({
      venue: {
        id: 1664,
        address: '2 RUE LAMENNAIS',
        city: 'PARIS 8',
        offerer: { name: 'PATHE BEAUGRENELLE' },
        name: 'PATHE BEAUGRENELLE',
        postalCode: '75008',
        publicName: undefined,
        coordinates: {},
      },
    })
    expect(wrapper.queryByText("Voir l'itinéraire")).toBeFalsy()
    expect(wrapper.queryByText('Distance')).toBeFalsy()
  })
})
