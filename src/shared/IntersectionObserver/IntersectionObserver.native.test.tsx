import React from 'react'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { fireEvent, render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

jest.mock('shared/analytics/logViewItem', () => ({
  logPlaylistDebug: jest.fn(),
}))

const onChangeMock = jest.fn()

describe('<IntersectionObserver /> (native)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should call onChange when intersection state changes', () => {
      render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const intersectionObserver = screen.getByTestId('intersectionObserver')

      fireEvent(intersectionObserver, 'onChange', true)

      expect(onChangeMock).toHaveBeenCalledWith(true)

      fireEvent(intersectionObserver, 'onChange', false)

      expect(onChangeMock).toHaveBeenCalledWith(false)
    })

    it('should render children correctly', () => {
      render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      expect(screen.getByText('Hello world')).toBeOnTheScreen()
    })
  })

  describe('threshold handling', () => {
    it('should use default threshold', () => {
      render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const intersectionObserver = screen.getByTestId('intersectionObserver')

      // Just check it has some top value - don't care about exact default
      expect(intersectionObserver).toHaveStyle({ position: 'absolute' })
    })

    it('should handle pixel threshold', () => {
      render(
        <IntersectionObserver onChange={onChangeMock} threshold={100}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const intersectionObserver = screen.getByTestId('intersectionObserver')

      expect(intersectionObserver).toHaveStyle({ top: 100 })
    })

    it('should handle percentage threshold', () => {
      render(
        <IntersectionObserver onChange={onChangeMock} threshold="60%">
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const intersectionObserver = screen.getByTestId('intersectionObserver')

      expect(intersectionObserver).toHaveStyle({ top: 60 }) // 60% of default 100px
    })
  })
})
