const emailFieldRegEx = /{email}/

// Some urls from the server contains a placeholder {email} that needs to be filled when the user is connected
// We create this helper to fill those url when necessary, if the user is still loading it returns null so the module would be disabled
export const getBusinessUrl = (url: string, email?: string) => {
  const shouldFillEmailPlaceholder = emailFieldRegEx.test(url)
  if (!shouldFillEmailPlaceholder) return url

  return email ? url.replace(emailFieldRegEx, email) : null
}
