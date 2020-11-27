export const fillUrlEmail = (url: string, email: string) => {
  return url.replace(/{email}/, email)
}
