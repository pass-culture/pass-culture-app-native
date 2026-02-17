const defaultTitle = 'Mon profil'

type Props = {
  firstName?: string | null
  lastName?: string | null
}

export const getProfileHeaderTitle = ({ firstName, lastName }: Props) => {
  return firstName && lastName ? `${firstName} ${lastName}` : defaultTitle
}
