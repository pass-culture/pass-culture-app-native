import { ScreenSeenCount, getScreenSeenCount } from './getScreenSeenCount'

const createStubTriggerStorage = () => {
  const triggered: number[] = []

  return {
    hasTriggered: async (screenSeenCount: ScreenSeenCount) => triggered.includes(screenSeenCount),
    setTriggered: async (screenSeenCount: ScreenSeenCount) => {
      triggered.push(screenSeenCount)
    },
    givenHasTriggered: async (screenSeenCount: ScreenSeenCount) => triggered.push(screenSeenCount),
    hasSetTriggered: () => triggered.length > 0,
  }
}

describe('getScreenSeenCount', () => {
  it('should call batch  when user has seen 3 times their screen of 500px height', async () => {
    const triggerStorage = createStubTriggerStorage()
    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 500,
      onTrigger,
      triggerStorage,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(onTrigger).toHaveBeenCalledWith(3)
  })

  it('should call batch when user has seen 5 times their screen of 500px height', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()
    hasSeenEnoughHomeContent.givenHasTriggered(3)
    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 500,
      onTrigger,
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(2500)

    expect(onTrigger).toHaveBeenCalledWith(5)
  })

  it('should NOT call batch when user has seen 2 times their screen height', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()
    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 500,
      onTrigger,
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(1000)

    expect(onTrigger).not.toHaveBeenCalled()
  })

  it('should call batch when user has seen 5 times their screen of 300px height', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()
    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 300,
      onTrigger,
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(onTrigger).toHaveBeenCalledWith(5)
  })

  it('should call batch when user has seen more than 5 times their screen of 300px height', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()
    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 300,
      onTrigger,
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(1501)

    expect(onTrigger).toHaveBeenCalledWith(5)
  })

  it('should NOT trigger 3 screen seen  when already triggered', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()
    hasSeenEnoughHomeContent.givenHasTriggered(3)

    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 300,
      onTrigger,
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(900)

    expect(onTrigger).not.toHaveBeenCalled()
  })

  it('should save that hasSeenEnoughHomeContent when triggered', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 300,
      onTrigger: jest.fn(),
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(hasSeenEnoughHomeContent.hasSetTriggered()).toBe(true)
  })

  it('should NOT save that hasSeenEnoughHomeContent when not triggered', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 300,
      onTrigger: jest.fn(),
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: true,
    })

    await checkTrigger(600)

    expect(hasSeenEnoughHomeContent.hasSetTriggered()).toBe(false)
  })

  it('should NOT trigger when user is not logged in', async () => {
    const hasSeenEnoughHomeContent = createStubTriggerStorage()

    const onTrigger = jest.fn()

    const { checkTrigger } = getScreenSeenCount({
      screenHeight: 300,
      onTrigger,
      triggerStorage: hasSeenEnoughHomeContent,
      isLoggedIn: false,
    })

    await checkTrigger(2500)

    expect(onTrigger).not.toHaveBeenCalled()
  })
})
