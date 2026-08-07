import { SWITCHABLE_ENVIRONMENTS, SwitchableEnvironment } from 'libs/environment/envOverride/types'

type ResolveEnvironmentOverrideInput = {
  buildEnvName: string
  isCheatcodesBuild: boolean
  storedValue: string | null
}

type ResolveEnvironmentOverrideResult =
  | { action: 'none' }
  | { action: 'purge' }
  | { action: 'apply'; target: SwitchableEnvironment }

const isSwitchableEnvironment = (value: string): value is SwitchableEnvironment =>
  (SWITCHABLE_ENVIRONMENTS as readonly string[]).includes(value)

export const resolveEnvironmentOverride = ({
  buildEnvName,
  isCheatcodesBuild,
  storedValue,
}: ResolveEnvironmentOverrideInput): ResolveEnvironmentOverrideResult => {
  if (storedValue === null) return { action: 'none' }

  const isInvalidOverride =
    buildEnvName !== 'testing' ||
    !isCheatcodesBuild ||
    !isSwitchableEnvironment(storedValue) ||
    storedValue === buildEnvName

  if (isInvalidOverride) return { action: 'purge' }
  return { action: 'apply', target: storedValue }
}
