# Pass Culture App Native Tracking Events

This document provides a complete reference of all analytics events tracked in the Pass Culture app native application. Events are logged via Firebase Analytics.

**Last Updated:** 2026-06-30  
**Total Events:** 195  
**Source:** `src/libs/analytics/logEventAnalytics.ts` and `src/libs/firebase/analytics/events.ts`

## Table of Contents

- [Authentication & Sign-up Events](#authentication--sign-up-events)
- [Booking Events](#booking-events)
- [Offer & Venue Events](#offer--venue-events)
- [Search & Navigation Events](#search--navigation-events)
- [User Profile & Settings](#user-profile--settings)
- [Modal & UI Interactions](#modal--ui-interactions)
- [Content & Discovery Events](#content--discovery-events)
- [Notification & Push Events](#notification--push-events)
- [Identity Check & Verification](#identity-check--verification-events)
- [Share & Social Events](#share--social-events)
- [Map & Location Events](#map--location-events)
- [Video & Media Events](#video--media-events)
- [Accessibility & Preferences](#accessibility--preferences)
- [Miscellaneous Events](#miscellaneous-events)

---

## Authentication & Sign-up Events

### logLogin
- **Firebase Event:** `login`
- **Parameters:**
  - `method: LoginRoutineMethod` - Login method (fromLogin, fromSignup, fromLoginApple, fromSignupApple, fromLoginGoogle, fromSignupGoogle, fromReinitializePassword, fromConfirmChangeEmail)
  - `type?: LoginType` - Optional: 'SSO_login' | 'SSO_signup' | 'email_login' | 'email_signup'
- **Trigger:** User logs in to the application

### logLoginClicked
- **Firebase Event:** `LoginClicked`
- **Parameters:**
  - `from: string` - Origin of the login action
- **Trigger:** User clicks on a login button/link

### logLogout
- **Firebase Event:** `Logout`
- **Parameters:** None
- **Trigger:** User logs out from the application

### logSignUpClicked
- **Firebase Event:** `SignUp`
- **Parameters:**
  - `from: string` - Origin/entry point of signup
- **Trigger:** User initiates sign-up process

### logSignUpFromAuthenticationModal
- **Firebase Event:** `SignUpFromAuthenticationModal`
- **Parameters:**
  - `offerId: number` - ID of the offer related to the signup
- **Trigger:** User signs up from an authentication modal while viewing an offer

### logSignUpFromFavorite
- **Firebase Event:** `SignUpFromFavorite`
- **Parameters:** None
- **Trigger:** User signs up from the favorites context

### logSignUpFromOffer
- **Firebase Event:** `SignUpFromOffer`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User signs up directly from an offer page

### logSignUpTooYoung
- **Firebase Event:** `SignUpTooYoung`
- **Parameters:**
  - `age: number` - Age of the user
- **Trigger:** User attempts to sign up but is under eligible age

### logSignInFromAuthenticationModal
- **Firebase Event:** `SignInFromAuthenticationModal`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User signs in from an authentication modal

### logSignInFromFavorite
- **Firebase Event:** `SignInFromFavorite`
- **Parameters:** None
- **Trigger:** User signs in from favorites section

### logSignInFromOffer
- **Firebase Event:** `SignInFromOffer`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User signs in from an offer page

### logCancelSignup
- **Firebase Event:** `CancelSignup`
- **Parameters:**
  - `pageName: string` - Page where signup was cancelled
- **Trigger:** User cancels the sign-up process

### logProfilSignUp
- **Firebase Event:** `ProfilSignUp`
- **Parameters:** None
- **Trigger:** User completes sign-up and reaches profile setup

---

## Booking Events

### logBookingConfirmation
- **Firebase Event:** `BookingConfirmation`
- **Parameters:**
  - `offerId: string` - ID of the booked offer
  - `bookingId: string` - ID of the booking
  - `fromOfferId?: string` - Optional: Previous offer ID
  - `fromMultivenueOfferId?: string` - Optional: Multi-venue offer ID
  - `playlistType?: PlaylistType` - Optional: Type of playlist
- **Trigger:** User successfully books an offer

### logBookingError
- **Firebase Event:** `BookingError`
- **Parameters:**
  - `offerId: number` - ID of the offer
  - `code: string` - Error code
- **Trigger:** Booking attempt fails with an error

### logBookingImpossibleiOS
- **Firebase Event:** `BookingImpossibleiOS`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** Booking is not possible on iOS platform for the offer

### logBookingOfferConfirmDates
- **Firebase Event:** `BookOfferConfirmDates`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User confirms dates in the booking flow

### logCancelBooking
- **Firebase Event:** `CancelBooking`
- **Parameters:**
  - `offerId: number` - ID of the booked offer
- **Trigger:** User initiates cancellation of a booking

### logCancelBookingFunnel
- **Firebase Event:** `CancelBookingFunnel`
- **Parameters:**
  - `offerId: number` - ID of the offer
  - `step: string` - Current step in cancellation funnel (STEP_LABEL mapped)
- **Trigger:** User progresses through booking cancellation steps

### logConfirmBookingCancellation
- **Firebase Event:** `ConfirmBookingCancellation`
- **Parameters:**
  - `offerId: number` - ID of the booking
- **Trigger:** User confirms the cancellation of a booking

### logBookingDetailsScrolledToBottom
- **Firebase Event:** `BookingDetailsScrolledToBottom`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User scrolls to the bottom of booking details page

### logBookingsScrolledToBottom
- **Firebase Event:** `BookingsScrolledToBottom`
- **Parameters:** None
- **Trigger:** User scrolls to the bottom of bookings list

### logSeeMyBooking
- **Firebase Event:** `SeeMyBooking`
- **Parameters:**
  - `offerId: number` - ID of the booking/offer
- **Trigger:** User views their booking details

### logViewedBookingPage
- **Firebase Event:** `ViewedBookingPage`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `offerId: number` - ID of the offer
- **Trigger:** User views the booking confirmation page

---

## Offer & Venue Events

### logConsultOffer
- **Firebase Event:** `ConsultOffer`
- **Parameters:** `ConsultOfferLogParams` (offerId, offerName, category, from, etc.)
- **Trigger:** User views an offer details page

### logConsultWholeOffer
- **Firebase Event:** `ConsultWholeOffer`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User views the complete/detailed offer information

### logConsultAvailableDates
- **Firebase Event:** `ConsultAvailableDates`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User checks available dates for booking

### logConsultDescriptionDetails
- **Firebase Event:** `ConsultDescriptionDetails`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User expands/views offer description details

### logConsultVenue
- **Firebase Event:** `ConsultVenue`
- **Parameters:**
  - `venueId: string` - ID of the venue
  - `from: Referrals` - Origin of navigation
  - `moduleName?: string` - Optional: Module name
  - `moduleId?: string` - Optional: Module ID
  - `homeEntryId?: string` - Optional: Home entry ID
  - `searchId?: string` - Optional: Search ID
  - `originDetails?: string` - Optional: Origin details
  - `adviceType?: string` - Optional: 'book_club' | 'cine_club' | 'pro'
  - `offerId?: string` - Optional: Associated offer ID
  - `displayAdvice?: boolean` - Optional: Whether advice is displayed
- **Trigger:** User views a venue page

### logConsultVenueOffers
- **Firebase Event:** `ConsultVenueOffers`
- **Parameters:**
  - `venueId: number` - ID of the venue
- **Trigger:** User views all offers from a venue

### logMultivenueOptionDisplayed
- **Firebase Event:** `MultivenueOptionDisplayed`
- **Parameters:**
  - `offerId: number` - ID of the offer
- **Trigger:** User sees an offer available at multiple venues

### logUserSetVenue
- **Firebase Event:** `UserSetVenue`
- **Parameters:**
  - `venueLabel: string` - Label/name of the venue
- **Trigger:** User selects/filters by a specific venue

### logVenueContact
- **Firebase Event:** `VenueContact`
- **Parameters:**
  - `type: string` - Contact type (phone, email, website, etc.)
  - `venueId: number` - ID of the venue
- **Trigger:** User initiates contact with a venue

### logClickEmailOrganizer
- **Firebase Event:** `ClickEmailOrganizer`
- **Parameters:** None
- **Trigger:** User clicks to email the event organizer

### logVenueSeeAllOffersClicked
- **Firebase Event:** `VenueSeeAllOffersClicked`
- **Parameters:**
  - `venueId: number` - ID of the venue
- **Trigger:** User clicks to see all offers from a venue

### logVenueSeeMoreClicked
- **Firebase Event:** `VenueSeeMoreClicked`
- **Parameters:**
  - `venueId: number` - ID of the venue
- **Trigger:** User clicks to see more venue details/offers

---

## Search & Navigation Events

### logPerformSearch
- **Firebase Event:** `PerformSearch`
- **Parameters:**
  - `searchState: SearchState` - Current search filters and state
  - `disabilities: DisabilitiesProperties` - Accessibility filters
  - `nbHits: number` - Number of search results
  - `currentView: SearchStackRouteName` - Current view/tab
- **Trigger:** User performs a search with filters

### logNoSearchResult
- **Firebase Event:** `NoSearchResult`
- **Parameters:**
  - `query: string` - Search query text
  - `searchId?: string` - Optional: Search session ID
- **Trigger:** Search returns no results

### logHasSearchedCinemaQuery
- **Firebase Event:** `HasSearchedCinemaQuery`
- **Parameters:** None
- **Trigger:** User searches specifically for cinema offers

### logSearchScrollToPage
- **Firebase Event:** `SearchScrollToPage`
- **Parameters:**
  - `page: number` - Page number scrolled to
  - `searchId?: string` - Optional: Search ID
- **Trigger:** User scrolls to a new page in search results

### logChangeSearchLocation
- **Firebase Event:** `ChangeSearchLocation`
- **Parameters:** (from event definition)
- **Trigger:** User changes search location/geolocation

### logExtendSearchRadiusClicked
- **Firebase Event:** `ExtendSearchRadiusClicked`
- **Parameters:**
  - `searchId?: string` - Optional: Search ID
- **Trigger:** User clicks to expand search radius

### logReinitializeFilters
- **Firebase Event:** `ReinitializeFilters`
- **Parameters:**
  - `searchId?: string` - Optional: Search ID
- **Trigger:** User resets all search filters

### logUseFilter
- **Firebase Event:** `UseFilter`
- **Parameters:** (from event definition)
- **Trigger:** User applies a search filter

### logDiscoverOffers
- **Firebase Event:** `DiscoverOffers`
- **Parameters:**
  - `from: Referrals` - Origin page
- **Trigger:** User accesses the discover/browse offers section

### logGoToProfil
- **Firebase Event:** `GoToProfil`
- **Parameters:**
  - `from: string` - Origin page
  - `offerId: number` - Associated offer ID
- **Trigger:** User navigates to profile page

---

## User Profile & Settings

### logModifyMail
- **Firebase Event:** `ModifyMail`
- **Parameters:** None
- **Trigger:** User changes their email address

### logSaveNewMail
- **Firebase Event:** `SaveNewMail`
- **Parameters:** None
- **Trigger:** User confirms new email address

### logHasCorrectedEmail
- **Firebase Event:** `HasCorrectedEmail`
- **Parameters:**
  - `from: Referrals` - Origin/trigger of correction
- **Trigger:** User corrects their email address

### logErrorSavingNewEmail
- **Firebase Event:** `ErrorSavingNewMail`
- **Parameters:**
  - `code: string` - Error code
- **Trigger:** Error occurs while saving new email

### logHasChangedPassword
- **Firebase Event:** `HasChangedPassword`
- **Parameters:**
  - `from: Referrals` - Origin of password change
  - `reason: string` - 'changePassword' | 'resetPassword'
- **Trigger:** User changes their password

### logHasChangedPhoneNumber
- **Firebase Event:** `HasChangedPhoneNumber`
- **Parameters:** None
- **Trigger:** User changes their phone number

### logUpdateAddress
- **Firebase Event:** `UpdateAddress`
- **Parameters:**
  - `newAddress: string` - New address
  - `oldAddress: string` - Previous address
- **Trigger:** User updates their address

### logUpdatePostalCode
- **Firebase Event:** `UpdatePostalCode`
- **Parameters:**
  - `oldCity: string` - Previous city
  - `oldPostalCode: string` - Previous postal code
  - `newCity: string` - New city
  - `newPostalCode: string` - New postal code
- **Trigger:** User updates their postal code/location

### logCopyAddress
- **Firebase Event:** `CopyAddress`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `venueId: number` - ID of venue address
- **Trigger:** User copies a venue address

### logProfilScrolledToBottom
- **Firebase Event:** `ProfilScrolledToBottom`
- **Parameters:** None
- **Trigger:** User scrolls to bottom of profile page

### logUpdateStatus
- **Firebase Event:** `UpdateStatus`
- **Parameters:**
  - `oldStatus: string` - Previous status
  - `newStatus: string` - New status
- **Trigger:** User updates their account status

### logAccountDeletion
- **Firebase Event:** `AccountDeletion`
- **Parameters:** None
- **Trigger:** User deletes their account

### logAccountReactivation
- **Firebase Event:** `AccountReactivation`
- **Parameters:**
  - `from: Referrals` - Origin/trigger of reactivation
- **Trigger:** User reactivates their deleted account

### logSelectDeletionReason
- **Firebase Event:** `SelectDeletionReason`
- **Parameters:**
  - `type: string` - Reason for deletion
- **Trigger:** User selects reason for account deletion

### logConsultArticleAccountDeletion
- **Firebase Event:** `ConsultArticleAccountDeletion`
- **Parameters:** None
- **Trigger:** User reads information about account deletion

---

## Modal & UI Interactions

### logConsultAuthenticationModal
- **Firebase Event:** `ConsultAuthenticationModal`
- **Parameters:**
  - `offerId: number` - ID of offer triggering the modal
- **Trigger:** User views authentication modal

### logQuitAuthenticationModal
- **Firebase Event:** `QuitAuthenticationModal`
- **Parameters:**
  - `offerId: number` - ID of offer
- **Trigger:** User closes authentication modal

### logQuitAuthenticationMethodSelection
- **Firebase Event:** `QuitAuthenticationMethodSelection`
- **Parameters:** None
- **Trigger:** User exits authentication method selection

### logConsultAchievementModal
- **Firebase Event:** `ConsultAchievementModale`
- **Parameters:**
  - `achievementName: string` - Name of achievement
  - `state: string` - 'unlocked' | 'locked'
- **Trigger:** User views an achievement modal

### logConsultAchievementsSuccessModal
- **Firebase Event:** `ConsultAchievementsSuccessModal`
- **Parameters:**
  - `achievementName: AchievementEnum[]` - Array of achievement names
- **Trigger:** User views success modal for achievements

### logHasDismissedModal
- **Firebase Event:** `HasDismissedModal`
- **Parameters:**
  - `moduleId: string` - ID of module with modal
  - `modalType: ContentTypes` - Type of modal content
  - `seenDuration: number` - Duration viewed in milliseconds
  - `videoDuration: number` - Total video duration
- **Trigger:** User closes a modal

### logHasDismissedAppSharingModal
- **Firebase Event:** `HasDismissedAppSharingModal`
- **Parameters:** None
- **Trigger:** User closes app sharing modal

### logConsultFinishSubscriptionModal
- **Firebase Event:** `ConsultFinishSubscriptionModal`
- **Parameters:**
  - `offerId: number` - ID of offer
- **Trigger:** User views finish subscription modal

### logConsultApplicationProcessingModal
- **Firebase Event:** `ConsultApplicationProcessingModal`
- **Parameters:**
  - `offerId: number` - ID of offer
- **Trigger:** User views application processing modal

### logConsultErrorApplicationModal
- **Firebase Event:** `ConsultErrorApplicationModal`
- **Parameters:**
  - `offerId: number` - ID of offer
- **Trigger:** User views application error modal

### logConsultSubscriptionModal
- **Firebase Event:** `ConsultSubscriptionModal`
- **Parameters:** None
- **Trigger:** User views subscription/eligibility modal

### logConsultDisclaimerValidationMail
- **Firebase Event:** `ConsultDisclaimerValidationMail`
- **Parameters:** None
- **Trigger:** User views disclaimer about validation email

---

## Content & Discovery Events

### logConsultHome
- **Firebase Event:** `ConsultHome`
- **Parameters:**
  - `homeEntryId: string` - ID of home page entry/session
- **Trigger:** User views the home page

### logConsultThematicHome
- **Firebase Event:** `ConsultHome` (same as ConsultHome)
- **Parameters:**
  - `from?: string` - Optional: Origin (e.g., 'video_carousel_block')
  - `moduleId?: string` - Optional: Module ID
  - `moduleListId?: string` - Optional: Module list ID
  - `moduleItemId?: string` - Optional: Module item ID
- **Trigger:** User views thematic home page

### logConsultTutorial
- **Firebase Event:** `ConsultTutorial`
- **Parameters:**
  - `from: string` - Origin/context
  - `age?: number` - Optional: User age
- **Trigger:** User views tutorial/onboarding

### logHasSkippedTutorial
- **Firebase Event:** `HasSkippedTutorial`
- **Parameters:**
  - `pageName: string` - Page where tutorial was skipped
- **Trigger:** User skips the tutorial

### logHasActivateGeolocFromTutorial
- **Firebase Event:** `HasActivateGeolocFromTutorial`
- **Parameters:** None
- **Trigger:** User enables geolocation during tutorial

### logOnboardingStarted
- **Firebase Event:** `OnboardingStarted`
- **Parameters:**
  - `type: string` - 'login' | 'start'
- **Trigger:** User starts onboarding process

### logOnboardingGeolocationClicked
- **Firebase Event:** `OnboardingGeolocationClicked`
- **Parameters:** (from event definition)
- **Trigger:** User interacts with geolocation in onboarding

### logModuleDisplayedOnHomepage
- **Firebase Event:** `ModuleDisplayedOnHomePage`
- **Parameters:**
  - `moduleId: string` - ID of the module
  - `moduleType: ContentTypes` - Type of content
  - `index: number` - Position in the list
  - `homeEntryId: string | undefined` - Home session ID
  - `hybridModuleOffsetIndex?: number | string` - Offset for hybrid modules
  - `call_id?: string | null` - Recommendation call ID
  - `offers?: string[]` - Optional: Offer IDs displayed
  - `venues?: string[]` - Optional: Venue IDs displayed
- **Trigger:** A module/block is displayed on home page

### logModuleDisplayed
- **Firebase Event:** `ModuleDisplayed`
- **Parameters:**
  - `moduleId: string` - ID of the module
  - `displayedOn: Referrals` - Which page showing the module
  - `venueId?: number` - Optional: Associated venue ID
- **Trigger:** A module is displayed in the app

### logAllModulesSeen
- **Firebase Event:** `AllModulesSeen`
- **Parameters:**
  - `numberOfModules: number` - Total modules viewed
- **Trigger:** User has scrolled through all modules

### logAllTilesSeen
- **Firebase Event:** `AllTilesSeen`
- **Parameters:**
  - `moduleName?: string` - Optional: Module name
  - `numberOfTiles?: number` - Optional: Number of tiles
  - `searchId?: string` - Optional: Search ID
  - `moduleId?: string` - Optional: Module ID
  - `venueId?: number` - Optional: Venue ID
  - `apiRecoParams?: RecommendationApiParams` - Optional: Recommendation parameters
- **Trigger:** User has seen all tiles in a module

### logRecommendationModuleSeen
- **Firebase Event:** `RecommendationModuleSeen`
- **Parameters:** (from event definition)
- **Trigger:** User views a recommendation module

### logPlaylistHorizontalScroll
- **Firebase Event:** `PlaylistHorizontalScroll`
- **Parameters:**
  - `fromOfferId?: number` - Optional: Starting offer ID
  - `playlistType?: PlaylistType` - Optional: Type of playlist
  - `apiRecoParams?: RecommendationApiParams` - Optional: Recommendation params
- **Trigger:** User scrolls horizontally through offers

### logPlaylistVerticalScroll
- **Firebase Event:** `PlaylistVerticalScroll`
- **Parameters:**
  - `offerId: number` - ID of offer
  - `playlistType: PlaylistType` - Type of playlist
  - `nbResults: number` - Number of results
  - `fromOfferId?: number` - Optional: Source offer ID
- **Trigger:** User scrolls vertically through playlist

### logClickSeeAll
- **Firebase Event:** `SeeAllClicked`
- **Parameters:**
  - `type: string` - 'offers' | 'venues' | 'artists'
  - `moduleName: string` - Name of module
  - `moduleId?: string` - Optional: Module ID
  - `homeEntryId?: string` - Optional: Home entry ID
  - `from?: Referrals` - Optional: Origin page
- **Trigger:** User clicks "See All" or similar expansion button

---

## Notification & Push Events

### logAcceptNotifications
- **Firebase Event:** `AcceptNotifications`
- **Parameters:** None
- **Trigger:** User accepts notification permissions

### logNotificationToggle
- **Firebase Event:** `NotificationToggle`
- **Parameters:**
  - `enableEmail: boolean` - Email notifications enabled
  - `enablePush?: boolean` - Optional: Push notifications enabled (always true on Android)
- **Trigger:** User changes notification preferences

### logOpenNotificationSettings
- **Firebase Event:** `OpenNotificationSettings`
- **Parameters:** None
- **Trigger:** User opens notification settings

### logDismissNotifications
- **Firebase Event:** `DismissNotifications`
- **Parameters:** None
- **Trigger:** User dismisses/ignores notification prompts

---

## Identity Check & Verification Events

### logIdentityCheckStep
- **Firebase Event:** `IdentityCheckStep`
- **Parameters:**
  - `nextStep: string` - Name of the step
  - `step: string` - Duplicate parameter for compatibility
- **Trigger:** User progresses through identity verification steps

### logIdentityCheckSuccess
- **Firebase Event:** `IdentityCheckSuccess`
- **Parameters:**
  - `method: IdentityCheckMethod` - Method used (Ubble, EduConnect, etc.)
- **Trigger:** User successfully completes identity verification

### logIdentityCheckAbort
- **Firebase Event:** `IdentityCheckAbort`
- **Parameters:**
  - `method: IdentityCheckMethod` - Verification method
  - `reason: string | null` - Reason for abort
  - `errorType: string | null` - Type of error if applicable
- **Trigger:** User aborts identity verification process

### logQuitIdentityCheck
- **Firebase Event:** `QuitIdentityCheck`
- **Parameters:**
  - `nextStep: string` - Step the user quit from
- **Trigger:** User quits identity check

### logContinueIdentityCheck
- **Firebase Event:** `ContinueIdentityCheck`
- **Parameters:** None
- **Trigger:** User continues with identity verification

### logChooseEduConnectMethod
- **Firebase Event:** `ChooseEduConnectMethod`
- **Parameters:** None
- **Trigger:** User selects EduConnect for identity verification

### logChooseUbbleMethod
- **Firebase Event:** `ChooseUbbleMethod`
- **Parameters:** None
- **Trigger:** User selects Ubble for identity verification

### logStartDMSTransmission
- **Firebase Event:** `StartDMSTransmission`
- **Parameters:** None
- **Trigger:** User initiates DMS document transmission

### logOpenDMSFrenchCitizenURL
- **Firebase Event:** `OpenDMSFrenchCitizenURL`
- **Parameters:** None
- **Trigger:** User opens DMS link for French citizens

### logOpenDMSForeignCitizenURL
- **Firebase Event:** `OpenDMSForeignCitizenURL`
- **Parameters:** None
- **Trigger:** User opens DMS link for foreign citizens

### logContinueSetPassword
- **Firebase Event:** `ContinueSetPassword`
- **Parameters:** (from event definition)
- **Trigger:** User continues password setup

### logContinueSetEmail
- **Firebase Event:** `ContinueSetEmail`
- **Parameters:** (from event definition)
- **Trigger:** User continues email setup

### logContinueSetBirthday
- **Firebase Event:** `ContinueSetBirthday`
- **Parameters:** (from event definition)
- **Trigger:** User continues birthday setup

### logSelectAge
- **Firebase Event:** `SelectAge`
- **Parameters:**
  - `age: string` - Selected age or 'NonEligible'
- **Trigger:** User selects their age category

### logContinueCGU
- **Firebase Event:** `ContinueCGU`
- **Parameters:** None
- **Trigger:** User accepts terms and conditions

### logContinueSignup
- **Firebase Event:** `ContinueSignup`
- **Parameters:** None
- **Trigger:** User progresses in signup flow

---

## Share & Social Events

### logShare
- **Firebase Event:** `Share`
- **Parameters:**
  - `from: Referrals` - Origin of share
  - `social?: Social | 'Other'` - Social platform or custom
  - `type: string` - 'Artist' | 'Offer' | 'Venue' | 'App'
  - Plus type-specific parameters (artistId, offerId, venueId)
- **Trigger:** User shares content (offer, artist, venue, or app)

### logShareApp
- **Firebase Event:** `ShareApp`
- **Parameters:**
  - `from?: Referrals` - Optional: Origin page
  - `type?: ShareAppModalType` - Optional: Share modal type
- **Trigger:** User shares the app itself

### logShowShareAppModal
- **Firebase Event:** `ShowShareAppModal`
- **Parameters:**
  - `type: ShareAppModalType` - Type of share modal
- **Trigger:** Share app modal is shown

### logHasSharedApp
- **Firebase Event:** `HasSharedApp`
- **Parameters:**
  - `type: string` - Type of share
- **Trigger:** User successfully shares the app

### logHasDismissedAppSharingModal
- **Firebase Event:** `HasDismissedAppSharingModal`
- **Parameters:** None
- **Trigger:** User dismisses app sharing prompt

### logDismissShareApp
- **Firebase Event:** `DismissShareApp`
- **Parameters:**
  - `type: ShareAppModalType` - Type of modal dismissed
- **Trigger:** User dismisses share app modal

### logClickSocialNetwork
- **Firebase Event:** `ClickSocialNetwork`
- **Parameters:**
  - `network: string` - Social network name (Instagram, TikTok, etc.)
- **Trigger:** User clicks social media link

---

## Map & Location Events

### logConsultVenueMap
- **Firebase Event:** `ConsultVenueMap`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `searchId?: string` - Optional: Search ID
- **Trigger:** User views venue map

### logPinMapPressed
- **Firebase Event:** `PinMapPressed`
- **Parameters:**
  - `venueType?: string | null` - Optional: Type of venue
  - `venueId: number` - ID of venue
- **Trigger:** User clicks on a map pin/marker

### logApplyVenueMapFilter
- **Firebase Event:** `ApplyVenueMapFilter`
- **Parameters:**
  - `venueType: string` - Type to filter by
- **Trigger:** User applies filter on venue map

### logVenueMapSeenDuration
- **Firebase Event:** `VenueMapSeenDuration`
- **Parameters:**
  - `duration: number` - Duration viewed in milliseconds
- **Trigger:** Tracks time spent viewing venue map

### logVenueMapSessionDuration
- **Firebase Event:** `VenueMapSessionDuration`
- **Parameters:**
  - `duration: number` - Total session duration
- **Trigger:** Tracks total venue map session duration

### logLocationToggle
- **Firebase Event:** `LocationToggle`
- **Parameters:**
  - `enabled: boolean` - Location enabled/disabled
- **Trigger:** User toggles location services

### logUserSetLocation
- **Firebase Event:** `UserSetLocation`
- **Parameters:**
  - `from: string` - 'home' | 'search' | 'venueMap'
- **Trigger:** User sets their location

### logActivateGeolocfromSearchResults
- **Firebase Event:** `ActivateGeolocfromSearchResults`
- **Parameters:** None
- **Trigger:** User enables geolocation from search results

### logOpenLocationSettings
- **Firebase Event:** `OpenLocationSettings`
- **Parameters:** None
- **Trigger:** User opens device location settings

---

## Video & Media Events

### logConsultVideo
- **Firebase Event:** `ConsultVideo`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `moduleId?: string` - Optional: Module ID
  - `homeEntryId?: string` - Optional: Home entry ID
  - `youtubeId?: string` - Optional: YouTube video ID
  - `offerId?: string` - Optional: Offer ID
- **Trigger:** User watches/views a video

### logVideoPaused
- **Firebase Event:** `VideoPaused`
- **Parameters:**
  - `videoDuration?: number` - Optional: Total video duration
  - `seenDuration: number` - Duration watched
  - `youtubeId?: string` - Optional: YouTube ID
  - `homeEntryId: string` - Home entry ID
  - `moduleId: string` - Module ID
- **Trigger:** User pauses a video

### logHasSeenAllVideo
- **Firebase Event:** `HasSeenAllVideo`
- **Parameters:**
  - `moduleId: string` - Module ID
  - `seenDuration?: number` - Optional: Duration watched
  - `videoDuration?: number` - Optional: Total duration
  - `youtubeId?: string` - Optional: YouTube ID
- **Trigger:** User watches complete video

### logClickSeeVideoTranscription
- **Firebase Event:** `ClickSeeVideoTranscription`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `moduleId?: string` - Optional: Module ID
  - `homeEntryId?: string` - Optional: Home entry ID
- **Trigger:** User clicks to view video transcription

---

## Favorites & Reactions

### logHasAddedOfferToFavorites
- **Firebase Event:** `HasAddedOfferToFavorites`
- **Parameters:**
  - `offerId: number` - ID of offer
  - `from?: Referrals` - Optional: Origin page
  - `moduleName?: string` - Optional: Module name
  - `moduleId?: string` - Optional: Module ID
  - `searchId?: string` - Optional: Search ID
  - `apiRecoParams?: RecommendationApiParams` - Optional: Recommendation params
  - `playlistType?: string` - Optional: Playlist type
- **Trigger:** User adds offer to favorites

### logHasAppliedFavoritesSorting
- **Firebase Event:** `HasAppliedFavoritesSorting`
- **Parameters:**
  - `type: FavoriteSortBy` - Sort method (recent, popular, distance, etc.)
- **Trigger:** User applies sorting to favorites

### logQuitFavoriteModalForSignIn
- **Firebase Event:** `QuitFavoriteModalForSignIn`
- **Parameters:**
  - `offerId: number` - ID of offer
- **Trigger:** User closes favorites modal to sign in

### logValidateReaction
- **Firebase Event:** `ValidateReaction`
- **Parameters:**
  - `offerId: number` - ID of offer
  - `reactionType: ReactionTypeEnum` - Type of reaction
  - `from: ReactionFromEnum` - Origin of reaction
  - `userId?: number` - Optional: User ID
- **Trigger:** User validates/submits a reaction

### logConsultReactionFakeDoor
- **Firebase Event:** `ConsultReactionFakeDoor`
- **Parameters:**
  - `from: NativeCategoryIdEnumv2` - Category
- **Trigger:** User views fake door for reactions feature

---

## Accessibility & Preferences

### logConsultAccessibility
- **Firebase Event:** `ConsultAccessibilityModalities`
- **Parameters:**
  - `offerId?: number` | `venueId?: number` - Either offer or venue ID
- **Trigger:** User checks accessibility information

### logAccessibilityBannerClicked
- **Firebase Event:** `AccessibilityBannerClicked`
- **Parameters:**
  - `action: string` - 'view_info' | 'contribute'
  - `acceslibreId?: string | null` - Optional: Acceslibre ID
- **Trigger:** User clicks accessibility banner

### logConsultAccessibilityModalities (See logConsultAccessibility)

### logHasOpenedAccessibilityAccordion
- **Firebase Event:** `HasOpenedAccessibilityAccordion`
- **Parameters:**
  - `handicap: string` - Type of disability/handicap
- **Trigger:** User expands accessibility accordion

### logConsultWithdrawal
- **Firebase Event:** `ConsultWithdrawalModalities`
- **Parameters:**
  - `offerId?: number` | `venueId?: number` - Either offer or venue ID
- **Trigger:** User views withdrawal/cancellation information

### logChangeOrientationToggle
- **Firebase Event:** `ChangeOrientationToggle`
- **Parameters:**
  - `enabled: boolean` - Screen orientation locked
- **Trigger:** User toggles screen orientation lock

### logAppThemeStatus
- **Firebase Event:** `AppThemeStatus`
- **Parameters:**
  - `themeSetting: ColorSchemeType` - Current theme setting
  - `systemTheme: ColorSchemeType` - System theme
  - `platform: string` - 'ios' | 'android'
- **Trigger:** Tracks app theme preference on app start

### logUpdateAppTheme
- **Firebase Event:** `UpdateAppTheme`
- **Parameters:**
  - `themeSetting: ColorSchemeType` - New theme setting
  - `systemTheme: ColorSchemeType` - System theme
  - `platform: string` - Platform name
- **Trigger:** User changes app theme

### logHasMadeAChoiceForCookies
- **Firebase Event:** `HasMadeAChoiceForCookies`
- **Parameters:**
  - `from: string` - Origin of choice
  - `type: string` - JSON stringified cookie choices
- **Trigger:** User accepts/rejects cookies

### logHasAcceptedAllCookies
- **Firebase Event:** `HasAcceptedAllCookies`
- **Parameters:** None
- **Trigger:** User accepts all cookies

### logHasRefusedCookie
- **Firebase Event:** `HasRefusedCookie`
- **Parameters:** None
- **Trigger:** User refuses cookies

### logHasOpenedCookiesAccordion
- **Firebase Event:** `HasOpenedCookiesAccordion`
- **Parameters:**
  - `type: string` - Type of cookies
- **Trigger:** User expands cookies information

---

## Subscriptions & Eligibility

### logSubscriptionUpdate
- **Firebase Event:** `SubscriptionUpdate`
- **Parameters:** `SubscriptionAnalyticsParams` (various subscription-related data)
- **Trigger:** User's subscription status changes

### logTrySelectDeposit
- **Firebase Event:** `TrySelectDeposit`
- **Parameters:**
  - `age: number` - User age
- **Trigger:** User attempts to select their deposit amount

### logConsultModalBeneficiaryCeilings
- **Firebase Event:** `ConsultModalBeneficiaryCeilings`
- **Parameters:** None
- **Trigger:** User views beneficiary credit ceiling information

### logConsultModalExpiredGrant
- **Firebase Event:** `ConsultModalExpiredGrant`
- **Parameters:** None
- **Trigger:** User views expired grant modal

---

## Account Security & Support

### logDismissAccountSecurity
- **Firebase Event:** `DismissAccountSecurity`
- **Parameters:** None
- **Trigger:** User dismisses account security prompt

### logDisplayForcedLoginHelpMessage
- **Firebase Event:** `DisplayForcedLoginHelpMessage`
- **Parameters:** None
- **Trigger:** Help message for forced login is shown

### logHasClickedContactForm
- **Firebase Event:** `HasClickedContactForm`
- **Parameters:**
  - `from: string` - Context (AccessibilityDeclaration, DeleteProfileContactSupport, etc.)
- **Trigger:** User clicks contact form

### logContactFraudTeam
- **Firebase Event:** `ContactFraudTeam`
- **Parameters:**
  - `from: Referrals` - Origin page
- **Trigger:** User contacts fraud team

### logHelpCenterContactSignupConfirmationEmailSent
- **Firebase Event:** `HelpCenterContactSignUpConfirmation`
- **Parameters:** None
- **Trigger:** Help center contact email sent after signup

### logResendEmailValidation
- **Firebase Event:** `ResendEmailValidation`
- **Parameters:** None
- **Trigger:** User resends validation email

### logSendActivationMailAgain
- **Firebase Event:** `SendActivationMailAgain`
- **Parameters:**
  - `times: number` - Number of resend attempts
- **Trigger:** User requests activation email again

### logResendEmailResetPasswordExpiredLink
- **Firebase Event:** `ResendEmailResetPasswordExpiredLink`
- **Parameters:** None
- **Trigger:** User resends expired password reset email

### logResendEmailSignupConfirmationExpiredLink
- **Firebase Event:** `ResendEmailSignupConfirmationExpiredLink`
- **Parameters:** None
- **Trigger:** User resends expired signup confirmation email

---

## Onboarding & Surveys

### logHasStartedCulturalSurvey
- **Firebase Event:** `hasStartedCulturalSurvey`
- **Parameters:** None
- **Trigger:** User begins cultural survey

### logHasSkippedCulturalSurvey
- **Firebase Event:** `hasSkippedCulturalSurvey`
- **Parameters:** None
- **Trigger:** User skips cultural survey

### logCulturalSurveyScrolledToBottom
- **Firebase Event:** `CulturalSurveyScrolledToBottom`
- **Parameters:**
  - `questionId?: string` - Optional: Question ID
- **Trigger:** User scrolls to end of cultural survey

### logConsultAdvice
- **Firebase Event:** `ConsultAdvice`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `originDetails: string` - Specific origin details
  - `adviceType: string` - 'book_club' | 'cine_club' | 'pro'
  - `offerId?: string` - Optional: Offer ID
  - `venueId?: string` - Optional: Venue ID
- **Trigger:** User views advice/recommendations

### logClickAllClubRecos
- **Firebase Event:** `ClickAllClubRecos`
- **Parameters:**
  - `offerId: string` - Offer ID
  - `from: Referrals` - Origin page
  - `categoryName: string` - Category name
- **Trigger:** User clicks to see all club recommendations

### logClickWhatsClub
- **Firebase Event:** `ClickWhatsClub`
- **Parameters:**
  - `offerId: string` - Offer ID
  - `from: Referrals` - Origin page
  - `categoryName: string` - Category name
- **Trigger:** User clicks "What's a club" explanation

### logClickInfoReview
- **Firebase Event:** `ClickInfoReview`
- **Parameters:**
  - `offerId: string` - Offer ID
  - `from: Referrals` - Origin page
  - `categoryName: string` - Category name
  - `userId?: string` - Optional: User ID
- **Trigger:** User clicks to view offer review information

---

## Blocks & Content Types

### logBusinessBlockClicked
- **Firebase Event:** `BusinessBlockClicked`
- **Parameters:**
  - `moduleName: string` - Name of module
  - `moduleId: string` - Module ID
  - `homeEntryId?: string` - Optional: Home entry ID
- **Trigger:** User clicks on business block

### logCategoryBlockClicked
- **Firebase Event:** `CategoryBlockClicked`
- **Parameters:**
  - `moduleId: string` - Module ID
  - `moduleListID: string` - List ID
  - `entryId: string` - Entry ID
  - `toEntryId: string` - Destination entry ID
- **Trigger:** User clicks category block

### logExclusivityBlockClicked
- **Firebase Event:** `ExclusivityBlockClicked`
- **Parameters:**
  - `moduleName: string` - Module name
  - `moduleId: string` - Module ID
  - `homeEntryId?: string` - Optional: Home entry ID
- **Trigger:** User clicks exclusivity block

### logHighlightBlockClicked
- **Firebase Event:** `HighlightBlockClicked`
- **Parameters:**
  - `moduleId: string` - Module ID
  - `entryId: string` - Entry ID
  - `toEntryId: string` - Destination ID
- **Trigger:** User clicks highlight block

### logTrendsBlockClicked
- **Firebase Event:** `TrendsBlockClicked`
- **Parameters:**
  - `moduleId: string` - Module ID
  - `moduleListID: string` - List ID
  - `entryId: string` - Entry ID
  - `toEntryId: string` - Destination ID
- **Trigger:** User clicks trends block

### logSystemBlockDisplayed
- **Firebase Event:** `SystemBlockDisplayed`
- **Parameters:**
  - `type: string` - 'credit' | 'location' | 'remoteActivationBanner' | 'remoteGenericBanner' | 'freeBeneficiaryBanner'
  - `from: string` - 'home' | 'thematicHome' | 'offer' | 'profile' | 'search' | 'cheatcodes'
- **Trigger:** System notification block is displayed

---

## Remote Banners & CTAs

### logHasClickedRemoteActivationBanner
- **Firebase Event:** `HasClickedRemoteActivationBanner`
- **Parameters:**
  - `from: RemoteBannerOrigin` - Origin location
  - `options: RemoteBannerType` - Banner configuration
- **Trigger:** User clicks remote activation banner

### logHasClickedRemoteGenericBanner
- **Firebase Event:** `HasClickedRemoteGenericBanner`
- **Parameters:**
  - `from: RemoteBannerOrigin` - Origin location
  - `options: RemoteBannerType` - Banner configuration
- **Trigger:** User clicks generic remote banner

### logClickVolunteerCTA
- **Firebase Event:** `ClickVolunteerCTA`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `venueId: string` - Venue ID
- **Trigger:** User clicks volunteer call-to-action

### logClickFakeDoorCTA
- **Firebase Event:** `HasClickedFakeDoorCTA`
- **Parameters:**
  - `featureName: string` - Name of feature
  - `from: Referrals` - Origin page
  - `searchId?: string` - Optional: Search ID
  - `homeEntryId?: string` - Optional: Home entry ID
- **Trigger:** User clicks fake door feature CTA

### logHasClickedFakeDoorCTA (Duplicate of above)

### logFeatureFeedbackClicked
- **Firebase Event:** `FeatureFeedbackClicked`
- **Parameters:**
  - `featureName: string` - Feature being rated
  - `feedbackResponse: string` - 'Oui' | 'Non'
  - `from: Referrals` - Origin page
  - `entryId?: string` - Optional: Entry ID
  - `venueId?: string` - Optional: Venue ID
  - `offerId?: string` - Optional: Offer ID
- **Trigger:** User provides feedback on feature

---

## Book Offer & Browsing

### logClickBookOffer
- **Firebase Event:** `ClickBookOffer`
- **Parameters:**
  - `offerId: number` - Offer ID
  - `from?: Referrals` - Optional: Origin
  - `searchId?: string` - Optional: Search ID
  - `apiRecoParams?: RecommendationApiParams` - Optional: Recommendation params
  - `playlistType?: PlaylistType` - Optional: Playlist type
- **Trigger:** User clicks to book an offer

### logHasBookedCineScreeningOffer
- **Firebase Event:** `HasBookedCineScreeningOffer`
- **Parameters:**
  - `offerId: number` - Cinema offer ID
- **Trigger:** User successfully books a cinema screening

### logConsultChronicle
- **Firebase Event:** `ConsultChronicle`
- **Parameters:**
  - `offerId?: number` - Optional: Offer ID
  - `chronicleId?: number` - Optional: Chronicle/review ID
- **Trigger:** User views a chronicle/review

### logConsultArtist
- **Firebase Event:** `ConsultArtist`
- **Parameters:**
  - `artistId: string` - Artist ID
  - `artistName: string` - Artist name
  - `from: Referrals` - Origin page
  - `offerId?: string` - Optional: Offer ID
  - `venueId?: string` - Optional: Venue ID
  - `searchId?: string` - Optional: Search ID
  - `originDetails?: string` - Optional: Origin details (similarArtistsPlaylist, venue, offer, searchResults)
- **Trigger:** User views artist profile/details

### logConsultArtistFakeDoor
- **Firebase Event:** `ConsultArtistFakeDoor`
- **Parameters:** None
- **Trigger:** User views fake door for artist feature

### logClickExpandArtistBio
- **Firebase Event:** `ClickExpandArtistBio`
- **Parameters:**
  - `artistId: string` - Artist ID
  - `artistName: string` - Artist name
  - `from: Referrals` - Origin page
- **Trigger:** User expands artist biography

### logClickAllClubRecos (See Club Recommendations section)

---

## Campaign & Tracking

### logCampaignTrackerEnabled
- **Firebase Event:** `CampaignTrackerEnabled`
- **Parameters:** None
- **Trigger:** Campaign tracking is enabled

---

## Connection & Technical

### logConnectionInfo
- **Firebase Event:** `ConnectionInfo`
- **Parameters:**
  - `type: string` - Connection type
  - `generation?: string | null` - Optional: Network generation (4G, 5G, etc.)
- **Trigger:** Connection information is logged

### logScreenView
- **Firebase Event:** `screen_view`
- **Parameters:** (Automatically tracked by Firebase)
- **Trigger:** User navigates to a new screen

---

## Debug & Development

### logClickCopyDebugInfo
- **Firebase Event:** `ClickCopyDebugInfo`
- **Parameters:**
  - `userId?: number` - Optional: User ID
- **Trigger:** User copies debug information

### logClickMailDebugInfo
- **Firebase Event:** `ClickMailDebugInfo`
- **Parameters:**
  - `userId?: number` - Optional: User ID
- **Trigger:** User mails debug information

### logClickForceUpdate
- **Firebase Event:** `ClickForceUpdate`
- **Parameters:**
  - `appVersionId: number` - Version ID
- **Trigger:** User clicks force update button

---

## Miscellaneous

### logOfferSeenDuration
- **Firebase Event:** `OfferSeenDuration`
- **Parameters:**
  - `duration: number` - Duration viewed in milliseconds
  - `offerId: number` - Offer ID
- **Trigger:** Tracks how long user views an offer

### logScreenshot
- **Firebase Event:** `Screenshot`
- **Parameters:**
  - `from: string` - Context of screenshot
  - `offerId?: number` - Optional: Offer ID
  - `venueId?: number` - Optional: Venue ID
  - `bookingId?: number` - Optional: Booking ID
- **Trigger:** User takes a screenshot

### logHasClickedGridListToggle
- **Firebase Event:** `HasClickedGridListToggle`
- **Parameters:**
  - `fromLayout: GridListLayout` - Current layout type
- **Trigger:** User toggles between grid and list views

### logHasClickedDuoStep
- **Firebase Event:** `HasClickedDuoStep`
- **Parameters:** None
- **Trigger:** User clicks duo/group booking step

### logDisplayAchievements
- **Firebase Event:** `DisplayAchievements`
- **Parameters:**
  - `from: string` - 'profile' | 'success' | 'cheatcodes'
  - `numberUnlocked: number` - Number of achievements unlocked
- **Trigger:** Achievements are displayed to user

### logStepperDisplayed
- **Firebase Event:** `StepperDisplayed`
- **Parameters:**
  - `from: StepperOrigin` - Origin/context
  - `step: string` - Current step name
  - `type?: SSOType` - Optional: 'SSO_login' | 'SSO_signup'
- **Trigger:** Stepper/progress indicator is displayed

### logConsultItinerary
- **Firebase Event:** `ConsultLocationItinerary`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `offerId?: number` | `venueId?: number` - Either offer or venue ID
- **Trigger:** User views directions/itinerary

### logConsultPracticalInformations
- **Firebase Event:** `ConsultPracticalInformations`
- **Parameters:**
  - `venueId: number` - Venue ID
- **Trigger:** User views practical information about venue

### logVenuePlaylistDisplayedOnSearchResults
- **Firebase Event:** `VenuePlaylistDisplayedOnSearchResults`
- **Parameters:**
  - `searchId?: string` - Optional: Search ID
  - `isLocated?: boolean` - Optional: Is user geolocated
  - `searchNbResults?: number` - Optional: Number of results
- **Trigger:** Venue playlist appears in search results

### logHasClickedTutorialFAQ
- **Firebase Event:** `HasClickedTutorialFAQ`
- **Parameters:**
  - `type?: string` - Optional: FAQ type (FAQ_LINK_PASS_CULTURE, FAQ_BONIFICATION_GENERIC, FAQ_LINK_CREDIT_V3)
- **Trigger:** User clicks FAQ link in tutorial

### logGoToParentsFAQ
- **Firebase Event:** `GoToParentsFAQ`
- **Parameters:** (from event definition)
- **Trigger:** User navigates to parents FAQ

### logAccessExternalOffer
- **Firebase Event:** `AccessExternalOffer`
- **Parameters:** (from event definition)
- **Trigger:** User accesses external offer link

### logOpenExternalUrl
- **Firebase Event:** `OpenExternalURL`
- **Parameters:**
  - `url: string` - URL opened (truncated to max length)
  - `offerId?: number` - Optional: Associated offer ID
- **Trigger:** User opens external URL

### logBackToHomeFromEduconnectError
- **Firebase Event:** `BackToHomeFromEduconnectError`
- **Parameters:**
  - `fromError: string` - Error type
- **Trigger:** User returns home after EduConnect error

### logHasExitedActivationFlow
- **Firebase Event:** `HasExitedActivationFlow`
- **Parameters:**
  - `from: Referrals` - Origin page
  - `origin_detail: CTAexitActivationFlow` - Specific exit action (Skip, Exit, AccessCatalog, FinishLater, Quit, IdentifyLater, Login, Close, GoToDemarcheNumerique)
- **Trigger:** User exits activation/onboarding flow

### logViewItem
- **Firebase Event:** `ViewItem`
- **Parameters:**
  - `PageTrackingInfo` - Page tracking parameters
  - `locationType: LocationMode` - Type of location tracking
- **Trigger:** Standard e-commerce event for item view

---

## Implementation Notes

### Event Validation Rules
- Event names must be 40 characters or less
- Must start with a letter
- Can only contain alphanumeric characters and underscores
- Cannot start with reserved prefixes: 'firebase_', 'google_', 'ga_'

### Tracking Implementation Pattern

1. **Define Event**: Add event to `AnalyticsEvent` enum in `src/libs/firebase/analytics/events.ts`
2. **Create Log Function**: Add function to `logEventAnalytics` in `src/libs/analytics/logEventAnalytics.ts`
3. **Create Mock**: Add mock function in `src/libs/analytics/__mocks__/logEventAnalytics.ts`
4. **Use in Code**: Import and call `logEventAnalytics.<functionName>()`

### Analytics Providers
- **Firebase Analytics**: Primary provider for app analytics
- **Multiple Providers**: Architecture supports future provider additions

### Common Parameters
- `from/Referrals`: Origin page/feature where action initiated
- `offerId`: Identifier of an offer
- `venueId`: Identifier of a venue
- `moduleId`: Identifier of a content module
- `searchId`: Identifier of a search session
- `duration`: Time in milliseconds

---

## Testing Events

For development and testing:
- Use Firebase DebugView to verify events in real-time
- Connect device with app debug enabled
- Run: `adb shell setprop debug.firebase.analytics.app app.passculture.testing` (Android)
- Add `-FIRDebugEnabled` launch argument (iOS)
- Check browser console with Google Analytics Debugger extension (Web)

