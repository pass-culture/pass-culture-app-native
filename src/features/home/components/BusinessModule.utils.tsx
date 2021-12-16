const emailFieldRegEx = /{email}/

export const fillUrlEmail = (url: string, email: string) => {
  return url.replace(emailFieldRegEx, email)
}

export const shouldUrlBeFilled = (url: string) => {
  return emailFieldRegEx.test(url)
}

export const showBusinessModule = (
  targetNotConnectedUsersOnly: boolean | undefined,
  connected: boolean
): boolean => {
  // Target both type of users
  if (targetNotConnectedUsersOnly === undefined) return true

  // Target only NON connected users
  if (!connected && targetNotConnectedUsersOnly) return true

  // Target only connected users
  if (connected && !targetNotConnectedUsersOnly) return true
  return false
}
