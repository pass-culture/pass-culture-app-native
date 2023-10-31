import React from 'react'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { fireEvent, render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

const onChangeMock = jest.fn()

describe('<IntersectionObserver />', () => {
  it('should call onChange with correct value when intersection changed', () => {
    render(
      <IntersectionObserver onChange={onChangeMock}>
        <Typo.Caption>Hello world</Typo.Caption>
      </IntersectionObserver>
    )

    const intersectionObserver = screen.getByTestId('intersectionObserver')
    fireEvent(intersectionObserver, 'onChange', true)

    expect(onChangeMock).toHaveBeenCalledWith(true)
  })

  it('should use a threshold at 0 by default to execute intersection changed', () => {
    render(
      <IntersectionObserver onChange={onChangeMock}>
        <Typo.Caption>Hello world</Typo.Caption>
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
        <Typo.Caption>Hello world</Typo.Caption>
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
        <Typo.Caption>Hello world</Typo.Caption>
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
        <Typo.Caption>Hello world</Typo.Caption>
      </IntersectionObserver>
    )

    expect(screen.getByText('Hello world')).toBeOnTheScreen()
  })
})
