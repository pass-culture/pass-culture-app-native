import React from 'react'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { act, render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

const onChangeMock = jest.fn()
const observeMock = jest.fn()
const disconnectMock = jest.fn()

let observerCallback: IntersectionObserverCallback | undefined

const installIntersectionObserver = () => {
  observerCallback = undefined
  globalThis.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
    observerCallback = callback
    return {
      observe: observeMock,
      unobserve: jest.fn(),
      disconnect: disconnectMock,
      takeRecords: () => [],
    }
  }) as unknown as typeof globalThis.IntersectionObserver
}

const visibleEntry = (isIntersecting: boolean) =>
  ({
    isIntersecting,
    boundingClientRect: { height: 100 },
    intersectionRect: { height: 100 },
  }) as IntersectionObserverEntry

const flushObserverSetup = () => {
  act(() => {
    jest.advanceTimersByTime(300)
  })
}

describe('<IntersectionObserver /> (native)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    installIntersectionObserver()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render children correctly', () => {
    render(
      <IntersectionObserver onChange={onChangeMock}>
        <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
      </IntersectionObserver>
    )

    expect(screen.getByText('Hello world')).toBeOnTheScreen()
  })

  it('should observe the target on mount', () => {
    render(
      <IntersectionObserver onChange={onChangeMock} threshold={0.8}>
        <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
      </IntersectionObserver>
    )

    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.8,
    })
    expect(observeMock).toHaveBeenCalledTimes(1)
  })

  it('should call onChange when the intersection state changes', () => {
    render(
      <IntersectionObserver onChange={onChangeMock}>
        <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
      </IntersectionObserver>
    )

    flushObserverSetup()
    act(() => {
      observerCallback?.([visibleEntry(true)], {} as IntersectionObserver)
    })

    expect(onChangeMock).toHaveBeenCalledWith(true)

    act(() => {
      observerCallback?.([visibleEntry(false)], {} as IntersectionObserver)
    })

    expect(onChangeMock).toHaveBeenCalledWith(false)
  })

  it('should disconnect the observer on unmount', () => {
    const { unmount } = render(
      <IntersectionObserver onChange={onChangeMock}>
        <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
      </IntersectionObserver>
    )

    flushObserverSetup()
    unmount()

    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })

  it('should not create an observer when IntersectionObserver is missing', () => {
    const { IntersectionObserver: OriginalIntersectionObserver } = globalThis
    // @ts-expect-error the runtime under test has no IntersectionObserver
    delete globalThis.IntersectionObserver

    render(
      <IntersectionObserver onChange={onChangeMock}>
        <Typo.BodyAccentXs>Hello world</Typo.BodyAccentXs>
      </IntersectionObserver>
    )

    flushObserverSetup()

    expect(onChangeMock).not.toHaveBeenCalled()

    globalThis.IntersectionObserver = OriginalIntersectionObserver
  })
})
