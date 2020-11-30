const emailFieldRegEx = /{email}/

export const fillUrlEmail = (url: string, email: string) => {
  return url.replace(emailFieldRegEx, email)
}

export const shouldUrlBeFilled = (url: string) => {
  return emailFieldRegEx.test(url)
}
