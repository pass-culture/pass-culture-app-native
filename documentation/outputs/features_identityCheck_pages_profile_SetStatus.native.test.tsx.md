SetStatus
 <SetStatus/>
- should render correctly
- should display correct infos in identity check
- should display correct infos in booking free offer 15/16 years
- should navigate to stepper on press "Continuer"
- should log analytics on press Continuer
- should not navigate to Offer screen if booking free offer and offer ID exists but FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable
- should navigate to Offer screen if booking free offer and offer ID exists when FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable
- should not navigate to Offer screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable
- should navigate to error screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable
- should reset profile stores after submission succeeds
- should call refetchUser after submission succeeds
- should navigate to error screen if posting profile fails
- should save status in local storage when clicking on status

