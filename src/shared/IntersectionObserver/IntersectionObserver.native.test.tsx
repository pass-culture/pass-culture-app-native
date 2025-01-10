import React from 'react'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { fireEvent, render, screen } from 'tests/utils'
import { TypoDS } from 'ui/theme'

const onChangeMock = jest.fn()

describe('<IntersectionObserver />', () => {
  it('should call onChange with correct value when intersection changed', () => {
    render(
      <IntersectionObserver onChange={onChangeMock}>
        <TypoDS.BodyAccentXs>Hello world</TypoDS.BodyAccentXs>
      </IntersectionObserver>
    )

    const intersectionObserver = screen.getByTestId('intersectionObserver')
    fireEvent(intersectionObserver, 'onChange', true)

    expect(onChangeMock).toHaveBeenCalledWith(true)
  })

  it('should use a threshold at 0 by default to execute intersection changed', () => {
    render(
      <IntersectionObserver onChange={onChangeMock}>
        <TypoDS.BodyAccentXs>Hello world</TypoDS.BodyAccentXs>
      </IntersectionObserver>
    )

    const intersectionObserver = screen.getByTestId('intersectionObserver')

    expect(intersectionObserver).toHaveStyle({
      top: 0,
    })
  })

  it('should use a number custom threshold to execute intersection changed', () => {
    render(
      <IntersectionObserver onChange={onChangeMock} threshold={100}>
        <TypoDS.BodyAccentXs>Hello world</TypoDS.BodyAccentXs>
      </IntersectionObserver>
    )

    const intersectionObserver = screen.getByTestId('intersectionObserver')

    expect(intersectionObserver).toHaveStyle({
      top: 100,
    })
  })

  it('should use a percent custom threshold to execute intersection changed', () => {
    render(
      <IntersectionObserver onChange={onChangeMock} threshold="60%">
        <TypoDS.BodyAccentXs>Hello world</TypoDS.BodyAccentXs>
      </IntersectionObserver>
    )

    const intersectionObserver = screen.getByTestId('intersectionObserver')

    expect(intersectionObserver).toHaveStyle({
      top: '60%',
    })
  })

  it('should render children correctly', () => {
    render(
      <IntersectionObserver onChange={onChangeMock} threshold="60%">
        <TypoDS.BodyAccentXs>Hello world</TypoDS.BodyAccentXs>
      </IntersectionObserver>
    )

    expect(screen.getByText('Hello world')).toBeOnTheScreen()
  })
})
