import React, { PropsWithChildren } from 'react'

import { eventBus } from 'events/eventBus'
import { EventBusProvider } from 'events/EventBusProvider'
import { SPLASHSCREEN_EVENTS } from 'events/eventNames'
import { SplashScreenProvider, useSplashScreenContext } from 'libs/splashscreen/splashscreen'
import { renderHook, act } from 'tests/utils'

describe('useSplashScreenContext()', () => {
  it('should hide splashscreen when "splashscreen.hide" event is emitted', async () => {
    const { result } = renderSplashScreenHook()
    act(() => {
      eventBus.emit(SPLASHSCREEN_EVENTS.HIDE)
    })

    expect(result.current.isSplashScreenHidden).toBe(true)
  })
})

const Wrapper = ({ children }: PropsWithChildren) => (
  <EventBusProvider>
    <SplashScreenProvider>{children}</SplashScreenProvider>
  </EventBusProvider>
)

function renderSplashScreenHook() {
  return renderHook(useSplashScreenContext, {
    wrapper: Wrapper,
  })
}
