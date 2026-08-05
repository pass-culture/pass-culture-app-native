import { resolveEnvironmentOverride } from 'libs/environment/envOverride/resolveEnvironmentOverride'

describe('resolveEnvironmentOverride', () => {
  it('should do nothing when no value is stored', () => {
    expect(
      resolveEnvironmentOverride({
        buildEnvName: 'testing',
        isCheatcodesBuild: true,
        storedValue: null,
      })
    ).toEqual({ action: 'none' })
  })

  it('should purge a stored value on a non-testing build', () => {
    expect(
      resolveEnvironmentOverride({
        buildEnvName: 'production',
        isCheatcodesBuild: true,
        storedValue: 'staging',
      })
    ).toEqual({ action: 'purge' })
  })

  it('should purge a stored value when cheatcodes are disabled', () => {
    expect(
      resolveEnvironmentOverride({
        buildEnvName: 'testing',
        isCheatcodesBuild: false,
        storedValue: 'staging',
      })
    ).toEqual({ action: 'purge' })
  })

  it('should purge a stored value outside the allowlist', () => {
    expect(
      resolveEnvironmentOverride({
        buildEnvName: 'testing',
        isCheatcodesBuild: true,
        storedValue: 'https://evil.example.com',
      })
    ).toEqual({ action: 'purge' })
  })

  it('should purge a stored value equal to the build environment', () => {
    expect(
      resolveEnvironmentOverride({
        buildEnvName: 'testing',
        isCheatcodesBuild: true,
        storedValue: 'testing',
      })
    ).toEqual({ action: 'purge' })
  })

  it.each(['staging', 'production'])(
    'should apply the override to %s when all guards pass',
    (target) => {
      expect(
        resolveEnvironmentOverride({
          buildEnvName: 'testing',
          isCheatcodesBuild: true,
          storedValue: target,
        })
      ).toEqual({ action: 'apply', target })
    }
  )
})
