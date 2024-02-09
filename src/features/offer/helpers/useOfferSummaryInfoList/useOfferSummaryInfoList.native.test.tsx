import mockdate from 'mockdate'
import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'

describe('useOfferSummaryInfoList', () => {
  it('should return summaryInfoItems when offer has atleast one in stock', async () => {
    const { result } = renderHook(
      () =>
        useOfferSummaryInfoList({
          offer: offerResponseSnap,
        }),
      {
        wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
      }
    )

    expect(result.current.summaryInfoItems).toEqual([
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: 'Tu peux prendre deux places',
        title: 'Duo',
      },
    ])
  })

  it('should return summaryInfoItems dates when offer stock has date in future', async () => {
    mockdate.set('2021-01-02T18:00:00')
    const offer: OfferResponse = {
      ...offerResponseSnap,
      isDuo: false,
    }
    const { result } = renderHook(
      () =>
        useOfferSummaryInfoList({
          offer,
        }),
      {
        wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
      }
    )

    expect(result.current.summaryInfoItems).toEqual([
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: 'Les 3 et 4 janvier 2021',
        title: 'Dates',
      },
    ])

    mockdate.reset()
  })

  it('should return summaryInfoItems online when offer is digital', async () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      isDuo: false,
      isDigital: true,
    }
    const { result } = renderHook(
      () =>
        useOfferSummaryInfoList({
          offer,
        }),
      {
        wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
      }
    )

    expect(result.current.summaryInfoItems).toEqual([
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: 'PATHE BEAUGRENELLE',
        title: 'En ligne',
      },
    ])
  })

  it('should return summaryInfoItems duration when offer has duration', async () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      isDuo: false,
      extraData: { durationMinutes: 180 },
    }
    const { result } = renderHook(
      () =>
        useOfferSummaryInfoList({
          offer,
        }),
      {
        wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
      }
    )

    expect(result.current.summaryInfoItems).toEqual([
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: '3h',
        title: 'Durée',
      },
    ])
  })

  it('should return many summaryInfoItems when offer has various details like duration, duo offer, digital offer', async () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      isDuo: true,
      isDigital: true,
      extraData: { durationMinutes: 180 },
    }
    const { result } = renderHook(
      () =>
        useOfferSummaryInfoList({
          offer,
        }),
      {
        wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
      }
    )

    expect(result.current.summaryInfoItems).toEqual([
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: 'PATHE BEAUGRENELLE',
        title: 'En ligne',
      },
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: '3h',
        title: 'Durée',
      },
      {
        Icon: expect.anything(),
        isDisplayed: true,
        subtitle: 'Tu peux prendre deux places',
        title: 'Duo',
      },
    ])
  })

  it('should not return summaryInfoItems when none are in offer stock', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      isDuo: false,
    }
    const { result } = renderHook(
      () =>
        useOfferSummaryInfoList({
          offer,
        }),
      {
        wrapper: ({ children }) => <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>,
      }
    )

    expect(result.current.summaryInfoItems).toEqual([])
  })
})
