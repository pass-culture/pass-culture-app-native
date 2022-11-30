class FirstLaunchError extends Error {
  name = 'FirstLaunchError'
  constructor() {
    super()
  }
}

export const didFirstLaunch = (ok: boolean) => {
  if (!ok) {
    throw new FirstLaunchError()
  }
}
