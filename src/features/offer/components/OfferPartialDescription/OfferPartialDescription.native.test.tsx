import { rest } from 'msw'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, render, screen } from 'tests/utils'

import { OfferPartialDescription } from './OfferPartialDescription'

const defaultDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua: https://google.com'
const offerId = 123
type Params = {
  description?: string
}
const defaultParams: Params = {
  description: defaultDescription,
}

server.use(
  rest.get<OfferResponse>(`${env.API_BASE_URL}/native/v1/offer/${offerId}`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(offerResponseSnap))
  )
)

describe('OfferPartialDescription', () => {
  it('centers CTA when provided description is empty', async () => {
    renderOfferDescription({
      ...defaultParams,
      description: '',
    })
    const offerSeeMoreContainer = await screen.findByTestId('offerSeeMoreContainer')
    expect(offerSeeMoreContainer.props.style[0].alignSelf).toBe('center')
  })

  it('places CTA on flex-end when provided a description', async () => {
    renderOfferDescription(defaultParams)
    const offerSeeMoreContainer = await screen.findByTestId('offerSeeMoreContainer')
    expect(offerSeeMoreContainer.props.style[0].alignSelf).toBe('flex-end')
  })

  it('renders externalLinks if http(s) url are present in the description', async () => {
    renderOfferDescription(defaultParams)
    expect(await screen.findByTestId('externalSiteIcon')).toBeTruthy()
  })

  it("shouldn't render an empty line and a spacer when description is empty", async () => {
    renderOfferDescription({
      ...defaultParams,
      description: undefined,
    })
    await screen.findByText('Voir plus d’informations')
    expect(screen.queryByTestId('offerPartialDescriptionBody')).toBeNull()
  })

  describe('SeeMore button', () => {
    const simulateOfferResponseWithNoDataInDescriptionPage = () => {
      server.use(
        rest.get<OfferResponse>(
          `${env.API_BASE_URL}/native/v1/offer/${offerId}`,
          (req, res, ctx) => {
            return res.once(
              ctx.status(200),
              ctx.json({
                ...offerResponseSnap,
                image: {},
                extraData: {},
              })
            )
          }
        )
      )
    }
    const simulateOfferResponseWithOnlyImageInDescriptionPage = () => {
      server.use(
        rest.get<OfferResponse>(
          `${env.API_BASE_URL}/native/v1/offer/${offerId}`,
          (req, res, ctx) => {
            return res.once(
              ctx.status(200),
              ctx.json({
                ...offerResponseSnap,
                extraData: {},
              })
            )
          }
        )
      )
    }

    it('should be rendered when there is some content on the description page', async () => {
      renderOfferDescription(defaultParams)
      expect(await screen.findByTestId('offerSeeMoreContainer')).toBeTruthy()
    })

    describe('should be rendered', () => {
      it('when the description is ellipsed', async () => {
        const lines = [
          { text: 'Ce n’est pas le besoin d’argent où les ' },
          { text: 'vieillards peuvent appréhender de tomber ' },
          { text: 'un jour qui les rend avares, car il y en a de ' },
          { text: 'tels qui ont de si grands fonds, qu’ils ne ' },
          { text: 'peuvent guère avoir cette inquiétude : et ' },
          { text: 'd’ailleurs comment pourraient-ils craindre ' },
          { text: 'de manquer dans leur caducité des ' },
          {
            text: 'commodités de la vie, puisqu’ils s’en privent eux-mêmes volontairement pour satisfaire à leur avarice ?',
          },
        ]
        const description = lines.map(({ text }) => text).join(' ')
        simulateOfferResponseWithNoDataInDescriptionPage()
        renderOfferDescription({
          ...defaultParams,
          description,
        })
        const descriptionComponent = screen.getByTestId('offerPartialDescriptionBody')

        act(() => {
          descriptionComponent.props.onTextLayout({ nativeEvent: { lines } })
        })

        expect(await screen.findByTestId('offerSeeMoreContainer')).toBeTruthy()
      })

      it('when there is image on the description page', async () => {
        simulateOfferResponseWithOnlyImageInDescriptionPage()
        renderOfferDescription({
          ...defaultParams,
          description: undefined,
        })
        expect(await screen.findByTestId('offerSeeMoreContainer')).toBeTruthy()
      })

      it('when there is extraData on the description page', async () => {
        server.use(
          rest.get<OfferResponse>(
            `${env.API_BASE_URL}/native/v1/offer/${offerId}`,
            (req, res, ctx) => {
              return res.once(
                ctx.status(200),
                ctx.json({
                  ...offerResponseSnap,
                  image: {},
                  extraData: { author: 'John Lang' },
                })
              )
            }
          )
        )
        renderOfferDescription({
          ...defaultParams,
          description: undefined,
        })
        expect(await screen.findByTestId('offerSeeMoreContainer')).toBeTruthy()
      })

      //TODO(PC-16305) unskip this test when upgrading to jest 27
      // eslint-disable-next-line jest/no-disabled-tests
      it.skip('when the description is small enough to be fully readable and there is image on the description page', async () => {
        const lines = [
          { text: 'Combattant sans risque, vous devez agir ' },
          { text: 'sans précaution. En effet, pour vous autres ' },
          { text: 'hommes, les défaites ne sont que des ' },
          { text: 'succès de moins. Dans cette partie si ' },
          { text: 'inégale, notre fortune est de ne pas perdre, ' },
          { text: 'et votre malheur de ne pas gagner.' },
        ]
        const description = lines.map(({ text }) => text).join(' ')
        simulateOfferResponseWithOnlyImageInDescriptionPage()
        renderOfferDescription({
          ...defaultParams,
          description,
        })
        const descriptionComponent = await screen.findByTestId('offerPartialDescriptionBody')

        act(() => {
          descriptionComponent.props.onTextLayout({ nativeEvent: { lines } })
        })

        expect(screen.findByTestId('offerSeeMoreContainer')).toBeTruthy()
      })
    })
    describe("shouldn't be rendered", () => {
      it('when there is no content on the description page', () => {
        simulateOfferResponseWithNoDataInDescriptionPage()
        renderOfferDescription({
          ...defaultParams,
          description: undefined,
        })

        expect(screen.queryByTestId('offerSeeMoreContainer')).toBeNull()
      })

      it('when the description is small enough to be fully readable', async () => {
        simulateOfferResponseWithNoDataInDescriptionPage()
        const lines = [
          { text: 'Combattant sans risque, vous devez agir ' },
          { text: 'sans précaution. En effet, pour vous autres ' },
          { text: 'hommes, les défaites ne sont que des ' },
          { text: 'succès de moins. Dans cette partie si ' },
          { text: 'inégale, notre fortune est de ne pas perdre, ' },
          { text: 'et votre malheur de ne pas gagner.' },
        ]
        const description = lines.map(({ text }) => text).join(' ')
        renderOfferDescription({
          ...defaultParams,
          description,
        })
        const descriptionComponent = await screen.findByTestId('offerPartialDescriptionBody')

        act(() => {
          descriptionComponent.props.onTextLayout({ nativeEvent: { lines } })
        })
        expect(screen.queryByTestId('offerSeeMoreContainer')).toBeNull()
      })
    })
  })
})

const renderOfferDescription = ({ description }: Params) => {
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<OfferPartialDescription id={offerId} description={description} />)
  )
  return wrapper
}
