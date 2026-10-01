import React from 'react'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver.web'
import { render, screen } from 'tests/utils/web'
import { Typo } from 'ui/theme'

// Mock IntersectionObserver API
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

const mockIntersectionObserverConstructor = jest.fn((callback) => {
  mockIntersectionObserver.mockImplementation(callback)
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserverConstructor,
})

const onChangeMock = jest.fn()

describe('IntersectionObserver (web)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should render children correctly', () => {
      render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })

    it('should call onChange when intersection changes', () => {
      render(
        <IntersectionObserver onChange={onChangeMock} threshold="100%">
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const callback = mockIntersectionObserverConstructor.mock.calls[0]?.[0]
      callback([
        {
          isIntersecting: true,
          boundingClientRect: { height: 100 },
          intersectionRect: { height: 100 },
        },
      ])

      expect(onChangeMock).toHaveBeenCalledWith(true)

      callback([
        {
          isIntersecting: true,
          boundingClientRect: { height: 100 },
          intersectionRect: { height: 20 },
        },
      ])

      expect(onChangeMock).toHaveBeenCalledWith(false)
    })

    it('should create IntersectionObserver instance on mount', () => {
      render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      expect(mockIntersectionObserverConstructor).toHaveBeenCalledTimes(1)
      expect(mockObserve).toHaveBeenCalledTimes(1)
    })
  })

  describe('threshold handling', () => {
    it('should handle all thresholds with simple observer options', () => {
      const { rerender } = render(
        <IntersectionObserver onChange={onChangeMock} threshold="50%">
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const callback = mockIntersectionObserverConstructor.mock.calls[0]?.[0]
      callback([
        {
          isIntersecting: true,
          boundingClientRect: { height: 100, width: 2000 },
          intersectionRect: { height: 80, width: 400 },
        },
      ])

      expect(onChangeMock).toHaveBeenCalledWith(true)

      rerender(
        <IntersectionObserver onChange={onChangeMock} threshold="100%">
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      const fullThresholdCallback = mockIntersectionObserverConstructor.mock.calls.at(-1)?.[0]
      fullThresholdCallback([
        {
          isIntersecting: true,
          boundingClientRect: { height: 100, width: 2000 },
          intersectionRect: { height: 80, width: 400 },
        },
      ])

      expect(onChangeMock).toHaveBeenLastCalledWith(false)
    })
  })

  describe('cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const { unmount } = render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      expect(mockObserve).toHaveBeenCalledTimes(1)

      unmount()

      expect(mockUnobserve).toHaveBeenCalledTimes(1)
      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })
  })

  describe('browser compatibility', () => {
    it('should handle missing IntersectionObserver gracefully', () => {
      const originalIO = window.IntersectionObserver
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).IntersectionObserver

      render(
        <IntersectionObserver onChange={onChangeMock}>
          <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
        </IntersectionObserver>
      )

      expect(onChangeMock).toHaveBeenCalledWith(true) // Fallback behavior

      window.IntersectionObserver = originalIO
    })
  })
})
