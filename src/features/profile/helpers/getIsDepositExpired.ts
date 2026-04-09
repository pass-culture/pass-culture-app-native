type Props = { depositExpirationDate?: string | null }
export const getIsDepositExpired = ({ depositExpirationDate }: Props): boolean =>
  !!depositExpirationDate?.trim() && new Date(depositExpirationDate).getTime() < Date.now()
