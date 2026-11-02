export const errorCodeToMessage: Record<string, string> = {
  INSUFFICIENT_CREDIT:
    'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!',
  ALREADY_BOOKED: 'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!',
  STOCK_NOT_BOOKABLE: 'Oups, cette offre n’est plus disponible\u00a0!',
  PROVIDER_STOCK_NOT_ENOUGH_SEATS: 'Désolé, il n’y a plus de place pour cette séance\u00a0!',
  PROVIDER_BOOKING_TIMEOUT: 'Nous t’invitons à réessayer un peu plus tard',
  PROVIDER_SHOW_DOES_NOT_EXIST: 'Oups, cette offre n’est plus disponible\u00a0!',
}
