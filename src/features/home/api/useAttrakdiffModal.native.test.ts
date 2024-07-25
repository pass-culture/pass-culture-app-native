import { useAttrakdiffModal } from './useAttrakdiffModal'

const createStubAttrakdiff = () => {
  let hasTriggered = false
  let hasSetTriggered = false

  return {
    hasTriggered: async () => hasTriggered,
    setTriggered: async () => {
      hasTriggered = true
      hasSetTriggered = true
    },
    givenHasTriggered: async (_hasTriggered: boolean) => (hasTriggered = _hasTriggered),
    hasSetTriggered: () => hasSetTriggered,
  }
}

describe('useAttrakdiffModal', () => {
  it('should call batch when user has seen 5 times their screen of 500px height', async () => {
    const attrakdiff = createStubAttrakdiff()
    let triggerCalled = false

    const onTrigger = async () => {
      triggerCalled = true
    }

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 500,
      onTrigger,
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(2500)

    expect(triggerCalled).toBe(true)
  })

  it('should NOT call batch when user has seen 3 times their screen height', async () => {
    const attrakdiff = createStubAttrakdiff()
    let triggerCalled = false

    const onTrigger = async () => {
      triggerCalled = true
    }

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 500,
      onTrigger,
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(triggerCalled).toBe(false)
  })

  it('should call batch when user has seen 5 times their screen of 300px height', async () => {
    const attrakdiff = createStubAttrakdiff()
    let triggerCalled = false

    const onTrigger = async () => {
      triggerCalled = true
    }

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 300,
      onTrigger,
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(triggerCalled).toBe(true)
  })

  it('should call batch when user has seen more than 5 times their screen of 300px height', async () => {
    const attrakdiff = createStubAttrakdiff()
    let triggerCalled = false

    const onTrigger = async () => {
      triggerCalled = true
    }

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 300,
      onTrigger,
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(1501)

    expect(triggerCalled).toBe(true)
  })

  it('should NOT trigger when already triggered', async () => {
    const attrakdiff = createStubAttrakdiff()
    attrakdiff.givenHasTriggered(true)

    let triggerCalled = false

    const onTrigger = async () => {
      triggerCalled = true
    }

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 300,
      onTrigger,
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(triggerCalled).toBe(false)
  })

  it('should save that attrakdiff has been seen when triggered', async () => {
    const attrakdiff = createStubAttrakdiff()

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 300,
      onTrigger: jest.fn(),
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(1500)

    expect(attrakdiff.hasSetTriggered()).toBe(true)
  })

  it('should NOT save that attrakdiff has been seen when not triggered', async () => {
    const attrakdiff = createStubAttrakdiff()

    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 300,
      onTrigger: jest.fn(),
      attrakdiff,
      isLoggedIn: true,
    })

    await checkTrigger(1000)

    expect(attrakdiff.hasSetTriggered()).toBe(false)
  })

  it('should NOT trigger when user is not logged in', async () => {
    const attrakdiff = createStubAttrakdiff()

    let triggerCalled = false

    const onTrigger = async () => {
      triggerCalled = true
    }
    const { checkTrigger } = useAttrakdiffModal({
      screenHeight: 300,
      onTrigger,
      attrakdiff,
      isLoggedIn: false,
    })

    await checkTrigger(2500)

    expect(triggerCalled).toBe(false)
  })
})
