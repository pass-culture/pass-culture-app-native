import { createAppStartTimeStore, useAppStartTimeStore } from 'shared/performance/appStartTimeStore'

class MyDate extends Date {
  constructor(date: string) {
    super(date)
  }
  now = () => 1732384186972
}

describe('AppStartTimeStore', () => {
  test('When start time the start time is correct', () => {
    const t = MyDate.now()
    const useTestAppStartTimeStore = createAppStartTimeStore(MyDate.now)
    const { appStartTime } = useTestAppStartTimeStore.getState()

    expect(appStartTime).toBe(t)
  })

  test('When start time is set it is in the store', () => {
    const { setAppStartTime, appStartTime } = useAppStartTimeStore.getState()
    const newTime = appStartTime + 1000
    setAppStartTime(newTime)

    expect(useAppStartTimeStore.getState().appStartTime).toBe(newTime)
  })
})
