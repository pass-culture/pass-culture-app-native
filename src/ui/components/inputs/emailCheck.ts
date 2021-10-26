import { useUserProfileInfo } from 'features/home/api'

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function isEmailValid(email: string) {
  return emailRegex.test(email)
}

export const useIsCurrentUserEmail = (email: string): boolean => {
  const { data: user } = useUserProfileInfo()
  return email === user?.email
}
