type Props = { depositExpirationDate?: string | null }

export const getIsDepositExpired = ({ depositExpirationDate }: Props): boolean => {
  return depositExpirationDate ? new Date(depositExpirationDate) < new Date() : false
}
