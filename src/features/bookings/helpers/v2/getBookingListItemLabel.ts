export const getBookingListItemLabel = ({
  dateLabel,
  canDisplayExpirationMessage,
  correctExpirationMessages,
  withdrawLabel,
}) => {
  if (withdrawLabel) return withdrawLabel
  if (canDisplayExpirationMessage) return correctExpirationMessages

  return dateLabel
}
