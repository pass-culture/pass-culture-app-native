# Documentation Complète - Trackers, Events et Paramètres

> **Date de génération**: 2026-02-11
> **Application**: Pass Culture App Native
> **Version du système d'analytics**: Multi-provider (Firebase, AppsFlyer, Batch, Algolia)

---

## Table des Matières

1. [Vue d'ensemble des Trackers](#1-vue-densemble-des-trackers)
2. [Firebase Analytics - Events Complets (204)](#2-firebase-analytics---events-complets)
3. [AppsFlyer - Campaign Events (4)](#3-appsflyer---campaign-events)
4. [Batch - Push Notification Events (16)](#4-batch---push-notification-events)
5. [Algolia Analytics](#5-algolia-analytics)
6. [Paramètres Communs](#6-paramètres-communs)
7. [Types et Enums](#7-types-et-enums)
8. [Fichiers Sources](#8-fichiers-sources)

---

## 1. Vue d'ensemble des Trackers

L'application utilise **4 systèmes de tracking** différents :

### 1.1 Firebase Analytics (Principal)
- **Rôle** : Tracking principal de toutes les interactions utilisateur
- **Configuration** : `src/libs/firebase/analytics/`
- **Nombre d'events** : 204 events
- **Provider** : Support natif et web

### 1.2 AppsFlyer (Attribution & Campagnes)
- **Rôle** : Attribution des installations et tracking des campagnes marketing
- **Configuration** : `src/libs/campaign/`
- **Nombre d'events** : 4 events spécifiques

### 1.3 Batch (Push Notifications & Engagement)
- **Rôle** : Segmentation utilisateur pour les notifications push
- **Configuration** : `src/libs/react-native-batch/`
- **Nombre d'events** : 16 events d'engagement

### 1.4 Algolia Analytics (Recherche)
- **Rôle** : Analytics des recherches et conversions
- **Configuration** : `src/libs/algolia/analytics/`
- **Events** : Conversions d'offres, clics sur offres/venues

---

## 2. Firebase Analytics - Events Complets

### 2.1 Compte & Authentification (18 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `ACCEPT_NOTIFICATIONS` | - | L'utilisateur accepte les notifications |
| `ACCOUNT_DELETION` | - | Suppression du compte utilisateur |
| `ACCOUNT_REACTIVATION` | `from: Referrals` | Réactivation du compte |
| `CANCEL_SIGNUP` | `pageName: string` | Annulation de l'inscription |
| `CONTINUE_CGU` | - | Continue après acceptation des CGU |
| `CONTINUE_IDENTITY_CHECK` | - | Continue le processus de vérification d'identité |
| `CONTINUE_SET_BIRTHDAY` | - | Continue après définition de la date de naissance |
| `CONTINUE_SET_EMAIL` | - | Continue après définition de l'email |
| `CONTINUE_SET_PASSWORD` | - | Continue après définition du mot de passe |
| `CONTINUE_SIGNUP` | - | Continue le processus d'inscription |
| `DISMISS_ACCOUNT_SECURITY` | - | Ferme l'alerte de sécurité du compte |
| `LOGIN` | `method: string`, `type?: SSOType` | Connexion utilisateur |
| `LOGIN_CLICKED` | `from: string` | Clic sur le bouton de connexion |
| `LOGOUT` | - | Déconnexion utilisateur |
| `PROFIL_SIGN_UP` | - | Inscription depuis le profil |
| `SIGN_UP` | `from: string` | Inscription utilisateur |
| `SIGN_UP_TOO_YOUNG` | `age: number` | Tentative d'inscription trop jeune |
| `UPDATE_STATUS` | `oldStatus: string`, `newStatus: string` | Mise à jour du statut utilisateur |

### 2.2 Réservations (15 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `BOOKING_CONFIRMATION` | `offerId: string`, `bookingId: string`, `fromOfferId?: string`, `fromMultivenueOfferId?: string`, `playlistType?: PlaylistType` | Confirmation d'une réservation |
| `BOOKING_DETAILS_SCROLLED_TO_BOTTOM` | `offerId: number` | L'utilisateur scrolle jusqu'en bas des détails de réservation |
| `BOOKING_ERROR` | `offerId: number`, `code: string` | Erreur lors de la réservation |
| `BOOKING_IMPOSSIBLE_IOS` | `offerId: number` | Réservation impossible sur iOS |
| `BOOKING_OFFER_CONFIRM_DATES` | `offerId: number` | Confirmation des dates de réservation |
| `BOOKINGS_SCROLLED_TO_BOTTOM` | - | Scroll jusqu'en bas de la liste des réservations |
| `CANCEL_BOOKING` | `offerId: number` | Annulation d'une réservation |
| `CANCEL_BOOKING_FUNNEL` | `step: string`, `offerId: number` | Sortie du tunnel de réservation |
| `CONFIRM_BOOKING_CANCELLATION` | `offerId: number` | Confirmation de l'annulation |
| `HAS_BOOKED_CINE_SCREENING_OFFER` | `offerId: number` | Réservation d'une séance ciné |
| `HAS_CLICKED_DUO_STEP` | - | Clic sur l'étape duo |
| `HAS_CHOSEN_PRICE` | - | Choix du prix |
| `HAS_CHOSEN_TIME` | - | Choix de l'horaire |
| `SEE_MY_BOOKING` | `offerId: number` | Voir ma réservation |
| `VIEWED_BOOKING_PAGE` | `from: Referrals`, `offerId: number` | Consultation de la page de réservation |

### 2.3 Consultation d'Offres (23 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `ACCESS_EXTERNAL_OFFER` | - | Accès à une offre externe |
| `CLICK_BOOK_OFFER` | `offerId: number`, `from?: Referrals`, `searchId?: string`, `apiRecoParams?: RecommendationApiParams`, `playlistType?: PlaylistType` | Clic sur réserver une offre |
| `CLICK_EMAIL_ORGANIZER` | - | Clic sur email organisateur |
| `CONSULT_ARTIST` | `artistId: string`, `artistName: string`, `from: Referrals`, `offerId?: string`, `venueId?: string`, `searchId?: string` | Consultation d'un artiste |
| `CONSULT_AUTHENTICATION_MODAL` | `offerId: number` | Consultation modale d'authentification |
| `CONSULT_AVAILABLE_DATES` | `offerId: number` | Consultation des dates disponibles |
| `CONSULT_CHRONICLE` | `offerId?: number`, `chronicleId?: number` | Consultation d'une chronique |
| `CONSULT_DESCRIPTION_DETAILS` | `offerId: number` | Consultation des détails de description |
| `CONSULT_OFFER` | `offerId: number`, `from: Referrals`, `moduleName?: string`, `moduleId?: string`, ... | Consultation d'une offre |
| `CONSULT_PRACTICAL_INFORMATIONS` | `venueId: number` | Consultation des infos pratiques |
| `CONSULT_VIDEO` | `from: Referrals`, `moduleId?: string`, `homeEntryId?: string`, `youtubeId?: string`, `offerId?: string` | Consultation d'une vidéo |
| `CONSULT_WHOLE_OFFER` | `offerId: number` | Consultation de l'offre complète |
| `CONSULT_WITHDRAWAL_MODALITIES` | `offerId?: number` ou `venueId?: number` | Consultation des modalités de retrait |
| `DISCOVER_OFFERS` | `from: Referrals` | Découverte d'offres |
| `HAS_ADDED_OFFER_TO_FAVORITES` | `offerId: number`, `from?: Referrals`, `moduleName?: string`, `moduleId?: string`, `searchId?: string`, `apiRecoParams?: RecommendationApiParams`, `playlistType?: string` | Ajout aux favoris |
| `MULTI_VENUE_OPTION_DISPLAYED` | `offerId: number` | Affichage option multi-venues |
| `OFFER_SEEN_DURATION` | `offerId: number`, `duration: number` | Durée de consultation de l'offre |
| `OPEN_EXTERNAL_URL` | `url: string`, `offerId?: number` | Ouverture d'une URL externe |
| `PLAYLIST_HORIZONTAL_SCROLL` | `fromOfferId?: number`, `playlistType?: PlaylistType`, `apiRecoParams?: RecommendationApiParams` | Scroll horizontal d'une playlist |
| `PLAYLIST_VERTICAL_SCROLL` | `offerId: number`, `playlistType: PlaylistType`, `nbResults: number`, `fromOfferId?: number` | Scroll vertical d'une playlist |
| `VIEW_ITEM` | `offerId: number`, `locationType: LocationMode`, ... | Vue d'un item (event e-commerce) |
| `CLICK_ALL_CLUB_RECOS` | `offerId: string`, `from: Referrals`, `categoryName: string` | Clic sur toutes les recos club |
| `CLICK_WHATS_CLUB` | `offerId: string`, `from: Referrals`, `categoryName: string` | Clic sur "C'est quoi le club ?" |

### 2.4 Recherche (11 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `ACTIVATE_GEOLOC_FROM_SEARCH_RESULTS` | - | Activation de la géoloc depuis les résultats |
| `CHANGE_SEARCH_LOCATION` | - | Changement de localisation de recherche |
| `EXTEND_SEARCH_RADIUS_CLICKED` | `searchId?: string` | Clic pour étendre le rayon de recherche |
| `HAS_SEARCHED_CINEMA_QUERY` | - | Recherche d'une requête cinéma |
| `NO_SEARCH_RESULT` | `query: string`, `searchId?: string` | Aucun résultat de recherche |
| `PERFORM_SEARCH` | `query: string`, `searchCategories: string`, `searchNativeCategories: string`, `searchGenreTypes: string`, `searchMaxPrice: string`, `searchMinPrice: string`, `searchOfferIsDuo: boolean`, `searchOfferIsFree: boolean`, `searchDate: string`, `searchNbResults: number`, `accessibilityFilter: string`, ... | Exécution d'une recherche |
| `REINITIALIZE_FILTERS` | `searchId?: string` | Réinitialisation des filtres |
| `SEARCH_SCROLL_TO_PAGE` | `page: number`, `searchId?: string` | Scroll vers une page de résultats |
| `USER_SET_LOCATION` | `from: 'home' \| 'search' \| 'venueMap'` | L'utilisateur définit sa localisation |
| `USER_SET_VENUE` | `venueLabel: string` | L'utilisateur définit un lieu |
| `USE_FILTER` | - | Utilisation d'un filtre |

### 2.5 Home & Modules (15 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `ALL_MODULES_SEEN` | `numberOfModules: number` | Tous les modules vus |
| `ALL_TILES_SEEN` | `moduleName?: string`, `numberOfTiles?: number`, `searchId?: string`, `moduleId?: string`, `venueId?: number`, `apiRecoParams?: RecommendationApiParams` | Toutes les tuiles vues |
| `BUSINESS_BLOCK_CLICKED` | `moduleName: string`, `moduleId: string`, `homeEntryId?: string` | Clic sur un bloc business |
| `CATEGORY_BLOCK_CLICKED` | `moduleId: string`, `moduleListID: string`, `entryId: string`, `toEntryId: string` | Clic sur un bloc catégorie |
| `CONSULT_HOME` | `homeEntryId: string` | Consultation de la home |
| `EXCLUSIVITY_BLOCK_CLICKED` | `moduleName: string`, `moduleId: string`, `homeEntryId?: string` | Clic sur un bloc exclusivité |
| `HIGHLIGHT_BLOCK_CLICKED` | `moduleId: string`, `entryId: string`, `toEntryId: string` | Clic sur un bloc highlight |
| `MODULE_DISPLAYED` | `moduleId: string`, `displayedOn: Referrals`, `venueId?: number` | Affichage d'un module |
| `MODULE_DISPLAYED_ON_HOMEPAGE` | `moduleId: string`, `moduleType: ContentTypes`, `index: number`, `homeEntryId?: string`, `hybridModuleOffsetIndex?: number \| string`, `call_id?: string`, `offers?: string[]`, `venues?: string[]` | Module affiché sur la home |
| `RECOMMENDATION_MODULE_SEEN` | - | Module de recommandation vu |
| `SEE_MORE_CLICKED` | `moduleName: string`, `moduleId: string`, `from?: Referrals`, `homeEntryId?: string` | Clic sur "Voir plus" |
| `SYSTEM_BLOCK_DISPLAYED` | `type: 'credit' \| 'location' \| 'remoteActivationBanner' \| 'remoteGenericBanner'`, `from: 'home' \| 'thematicHome' \| 'offer' \| 'profile' \| 'search' \| 'cheatcodes'` | Affichage d'un bloc système |
| `TRENDS_BLOCK_CLICKED` | `moduleId: string`, `moduleListID: string`, `entryId: string`, `toEntryId: string` | Clic sur un bloc tendances |
| `STEPPER_DISPLAYED` | `from: StepperOrigin`, `step: string`, `type?: SSOType` | Affichage du stepper |
| `ONBOARDING_STARTED` | `type: 'login' \| 'start'` | Démarrage de l'onboarding |

### 2.6 Venue (10 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `APPLY_VENUE_MAP_FILTER` | `venueType: string` | Application d'un filtre sur la carte des lieux |
| `CONSULT_VENUE` | `venueId: string`, `from: Referrals`, `moduleName?: string`, `moduleId?: string`, `homeEntryId?: string`, `searchId?: string` | Consultation d'un lieu |
| `CONSULT_VENUE_MAP` | `from: Referrals`, `searchId?: string` | Consultation de la carte des lieux |
| `CONSULT_VENUE_OFFERS` | `venueId: number` | Consultation des offres d'un lieu |
| `PIN_MAP_PRESSED` | `venueType?: string`, `venueId: number` | Clic sur une épingle de la carte |
| `VENUE_CONTACT` | `type: keyof VenueContact`, `venueId: number` | Contact d'un lieu |
| `VENUE_MAP_SEEN_DURATION` | `duration: number` | Durée de consultation de la carte |
| `VENUE_MAP_SESSION_DURATION` | `duration: number` | Durée de session sur la carte |
| `VENUE_PLAYLIST_DISPLAYED_ON_SEARCH_RESULTS` | `searchId?: string`, `isGeolocated?: boolean`, `searchNbResults?: number` | Playlist de lieux affichée dans les résultats |
| `VENUE_SEE_ALL_OFFERS_CLICKED` | `venueId: number` | Clic pour voir toutes les offres d'un lieu |
| `VENUE_SEE_MORE_CLICKED` | `venueId: number` | Clic sur "Voir plus" d'un lieu |

### 2.7 Vérification d'Identité (7 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CHOOSE_EDUCONNECT_METHOD` | - | Choix de la méthode Educonnect |
| `CHOOSE_UBBLE_METHOD` | - | Choix de la méthode Ubble |
| `IDENTITY_CHECK_ABORT` | `method: IdentityCheckMethod`, `reason: string \| null`, `errorType: string \| null` | Abandon de la vérification |
| `IDENTITY_CHECK_STEP` | `nextStep: string`, `step: string` | Étape de vérification |
| `IDENTITY_CHECK_SUCCESS` | `method: IdentityCheckMethod` | Succès de la vérification |
| `QUIT_IDENTITY_CHECK` | `nextStep: string` | Quitter la vérification |
| `CONTACT_FRAUD_TEAM` | `from: Referrals` | Contact de l'équipe fraude |

### 2.8 Accessibilité & Paramètres (12 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `ACCESSIBILITY_BANNER_CLICKED` | `acceslibreId?: string` | Clic sur la bannière accessibilité |
| `APP_THEME_STATUS` | `themeSetting: ColorSchemeType`, `systemTheme: ColorSchemeType`, `platform: Platform.OS` | Statut du thème de l'app |
| `CHANGE_ORIENTATION_TOGGLE` | `enabled: boolean` | Changement du toggle d'orientation |
| `CONSULT_ACCESSIBILITY_MODALITIES` | `offerId?: number` ou `venueId?: number` | Consultation des modalités d'accessibilité |
| `HAS_OPENED_ACCESSIBILITY_ACCORDION` | `handicap: string` | Ouverture de l'accordéon accessibilité |
| `LOCATION_TOGGLE` | `enabled: boolean` | Toggle de localisation |
| `NOTIFICATION_TOGGLE` | `enableEmail: boolean`, `enablePush?: boolean` | Toggle de notifications |
| `OPEN_LOCATION_SETTINGS` | - | Ouverture des paramètres de localisation |
| `OPEN_NOTIFICATION_SETTINGS` | - | Ouverture des paramètres de notifications |
| `UPDATE_APP_THEME` | `themeSetting: ColorSchemeType`, `systemTheme: ColorSchemeType`, `platform: Platform.OS` | Mise à jour du thème |
| `UPDATE_ADDRESS` | `newAddress: string`, `oldAddress: string` | Mise à jour de l'adresse |
| `UPDATE_POSTAL_CODE` | `oldCity: string`, `oldPostalCode: string`, `newCity: string`, `newPostalCode: string` | Mise à jour du code postal |

### 2.9 Cookies & Confidentialité (7 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `HAS_ACCEPTED_ALL_COOKIES` | - | Acceptation de tous les cookies |
| `HAS_MADE_A_CHOICE_FOR_COOKIES` | `from: string`, `type: CookiesChoiceByCategory` (JSON string) | Choix personnalisé de cookies |
| `HAS_OPENED_COOKIES_ACCORDION` | `type: string` | Ouverture de l'accordéon cookies |
| `HAS_REFUSED_COOKIE` | - | Refus des cookies |
| `CAMPAIGN_TRACKER_ENABLED` | - | Tracker de campagne activé |

### 2.10 Partage & Social (8 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CLICK_SOCIAL_NETWORK` | `network: string` | Clic sur un réseau social |
| `DISMISS_SHARE_APP` | `type: ShareAppModalType` | Fermeture modale de partage |
| `HAS_DISMISSED_APP_SHARING_MODAL` | - | Fermeture modale de partage de l'app |
| `HAS_SHARED_APP` | `type: string` | Partage de l'application |
| `SCREENSHOT` | `from: string`, `offerId?: number` ou `venueId?: number` ou `bookingId?: number` | Capture d'écran |
| `SHARE` | `from: Referrals`, `social?: Social \| 'Other'`, `type: 'Offer' \| 'Venue' \| 'App'`, `offerId?: number`, `venueId?: number` | Partage |
| `SHARE_APP` | `from?: Referrals`, `type?: ShareAppModalType` | Partage de l'app |
| `SHOW_SHARE_APP_MODAL` | `type: ShareAppModalType` | Affichage modale de partage |

### 2.11 Tutorial & Onboarding (6 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CONSULT_TUTORIAL` | `from: string`, `age?: number` | Consultation du tutoriel |
| `HAS_ACTIVATE_GEOLOC_FROM_TUTORIAL` | - | Activation géoloc depuis le tutoriel |
| `HAS_CLICKED_TUTORIAL_FAQ` | - | Clic sur la FAQ du tutoriel |
| `HAS_SKIPPED_TUTORIAL` | `pageName: string` | Saut du tutoriel |
| `ONBOARDING_GEOLOCATION_CLICKED` | - | Clic géolocalisation onboarding |
| `OPEN_APP` | `appsFlyerUserId?: string` | Ouverture de l'application |

### 2.12 Enquête Culturelle (4 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CULTURAL_SURVEY_SCROLLED_TO_BOTTOM` | `questionId?: string` | Scroll enquête culturelle jusqu'en bas |
| `HAS_SKIPPED_CULTURAL_SURVEY` | - | Saut de l'enquête culturelle |
| `HAS_STARTED_CULTURAL_SURVEY` | - | Début de l'enquête culturelle |
| `PROFIL_SCROLLED_TO_BOTTOM` | - | Scroll profil jusqu'en bas |

### 2.13 Achievements (3 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CONSULT_ACHIEVEMENT_MODAL` | `achievementName: string`, `state: 'unlocked' \| 'locked'` | Consultation modale achievement |
| `CONSULT_ACHIEVEMENTS_SUCCESS_MODAL` | `achievementName: AchievementEnum[]` | Modale de succès achievements |
| `DISPLAY_ACHIEVEMENTS` | `from: 'profile' \| 'success' \| 'cheatcodes'`, `numberUnlocked: number` | Affichage des achievements |

### 2.14 Vidéo (4 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CONSULT_VIDEO` | `from: Referrals`, `moduleId?: string`, `homeEntryId?: string`, `youtubeId?: string`, `offerId?: string` | Consultation d'une vidéo |
| `HAS_DISMISSED_MODAL` | `moduleId: string`, `modalType: ContentTypes`, `seenDuration: number`, `videoDuration: number` | Fermeture d'une modale vidéo |
| `HAS_SEEN_ALL_VIDEO` | `moduleId: string`, `seenDuration?: number`, `videoDuration?: number`, `youtubeId?: string` | Vidéo vue entièrement |
| `VIDEO_PAUSED` | `videoDuration?: number`, `seenDuration: number`, `youtubeId?: string`, `homeEntryId: string`, `moduleId: string` | Vidéo mise en pause |

### 2.15 Modales (10 events)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `CONSULT_APPLICATION_PROCESSING_MODAL` | `offerId: number` | Modale traitement candidature |
| `CONSULT_ERROR_APPLICATION_MODAL` | `offerId: number` | Modale erreur candidature |
| `CONSULT_FINISH_SUBSCRIPTION_MODAL` | `offerId: number` | Modale fin d'inscription |
| `CONSULT_MODAL_BENEFICIARY_CEILINGS` | - | Modale plafonds bénéficiaire |
| `CONSULT_MODAL_EXPIRED_GRANT` | - | Modale crédit expiré |
| `CONSULT_SUBSCRIPTION_MODAL` | - | Modale d'abonnement |
| `HAS_CLICKED_FAKE_DOOR_CTA` | - | Clic sur CTA fake door |
| `QUIT_AUTHENTICATION_MODAL` | `offerId: number` | Quitter modale authentification |
| `QUIT_FAVORITE_MODAL_FOR_SIGN_IN` | `offerId: number` | Quitter modale favoris pour connexion |

### 2.16 Autres Events (62 events restants)

| Event | Paramètres | Description |
|-------|-----------|-------------|
| `BACK_TO_HOME_FROM_EDUCONNECT_ERROR` | `fromError: string` | Retour home depuis erreur Educonnect |
| `CLICK_COPY_DEBUG_INFO` | `userId?: number` | Copie des infos de debug |
| `CLICK_EXPAND_ARTIST_BIO` | `artistId: string`, `artistName: string`, `from: Referrals` | Expansion bio artiste |
| `CLICK_FORCE_UPDATE` | `appVersionId: number` | Clic sur mise à jour forcée |
| `CLICK_INFO_REVIEW` | `offerId: string`, `from: Referrals`, `categoryName: string`, `userId?: string` | Clic info review |
| `CLICK_MAIL_DEBUG_INFO` | `userId?: number` | Clic email debug info |
| `CONNECTION_INFO` | `type: string`, `generation?: string` | Infos de connexion |
| `CONSULT_ARTICLE_ACCOUNT_DELETION` | - | Consultation article suppression compte |
| `CONSULT_ARTIST_FAKE_DOOR` | - | Consultation fake door artiste |
| `CONSULT_DISCLAIMER_VALIDATION_MAIL` | - | Consultation disclaimer validation mail |
| `CONSULT_ITINERARY` | `offerId?: number` ou `venueId?: number`, `from: Referrals` | Consultation itinéraire |
| `CONSULT_REACTION_FAKE_DOOR` | `from: NativeCategoryIdEnumv2` | Consultation fake door réaction |
| `CONSULT_VENUE_VIDEO_FAKE_DOOR` | `venueType?: string` | Consultation fake door vidéo venue |
| `COPY_ADDRESS` | `from: Referrals`, `venueId: number` | Copie d'adresse |
| `DISMISS_NOTIFICATIONS` | - | Rejet des notifications |
| `DISPLAY_FORCED_LOGIN_HELP_MESSAGE` | - | Affichage message aide connexion forcée |
| `ERROR_SAVING_NEW_EMAIL` | `code: string` | Erreur sauvegarde nouvel email |
| `GO_TO_PROFIL` | `from: string`, `offerId: number` | Aller au profil |
| `HAS_APPLIED_FAVORITES_SORTING` | `type: FavoriteSortBy` | Tri des favoris appliqué |
| `HAS_CHANGED_PASSWORD` | `from: Referrals`, `reason: 'changePassword' \| 'resetPassword'` | Changement de mot de passe |
| `HAS_CLICKED_CONTACT_FORM` | `from: string` | Clic sur formulaire de contact |
| `HAS_CLICKED_GRID_LIST_TOGGLE` | `fromLayout: GridListLayout` | Toggle grille/liste |
| `HAS_CLICKED_MISSING_CODE` | - | Clic code manquant |
| `HAS_CLICKED_REMOTE_ACTIVATION_BANNER` | `from: RemoteBannerOrigin`, `options: RemoteBannerType` | Clic bannière activation remote |
| `HAS_CLICKED_REMOTE_GENERIC_BANNER` | `from: RemoteBannerOrigin`, `options: RemoteBannerType` | Clic bannière générique remote |
| `HAS_CORRECTED_EMAIL` | `from: Referrals` | Correction d'email |
| `HAS_REQUESTED_CODE` | - | Demande de code |
| `HELP_CENTER_CONTACT_SIGNUP_CONFIRMATION_EMAIL_SENT` | - | Email confirmation inscription envoyé |
| `MODIFY_MAIL` | - | Modification email |
| `OPEN_DMS_FOREIGN_CITIZEN_URL` | - | Ouverture URL DMS citoyen étranger |
| `OPEN_DMS_FRENCH_CITIZEN_URL` | - | Ouverture URL DMS citoyen français |
| `QUIT_AUTHENTICATION_METHOD_SELECTION` | - | Quitter sélection méthode auth |
| `RESEND_EMAIL_RESET_PASSWORD_EXPIRED_LINK` | - | Renvoyer email reset mdp lien expiré |
| `RESEND_EMAIL_SIGNUP_CONFIRMATION_EXPIRED_LINK` | - | Renvoyer email confirmation inscription |
| `RESEND_EMAIL_VALIDATION` | - | Renvoyer email validation |
| `SAVE_NEW_MAIL` | - | Sauvegarder nouvel email |
| `SCREEN_VIEW` | - | Vue d'écran (générique) |
| `SELECT_AGE` | `age: number` | Sélection d'âge |
| `SELECT_DELETION_REASON` | `type: string` | Sélection raison de suppression |
| `SEND_ACTIVATION_MAIL_AGAIN` | `times: number` | Renvoyer email d'activation |
| `SIGN_IN_FROM_AUTHENTICATION_MODAL` | `offerId: number` | Connexion depuis modale auth |
| `SIGN_IN_FROM_FAVORITE` | - | Connexion depuis favoris |
| `SIGN_IN_FROM_OFFER` | `offerId: number` | Connexion depuis offre |
| `SIGN_UP_FROM_AUTHENTICATION_MODAL` | `offerId: number` | Inscription depuis modale auth |
| `SIGN_UP_FROM_FAVORITE` | - | Inscription depuis favoris |
| `SIGN_UP_FROM_OFFER` | `offerId: number` | Inscription depuis offre |
| `START_DMS_TRANSMISSION` | - | Démarrage transmission DMS |
| `SUBSCRIPTION_UPDATE` | `params: SubscriptionAnalyticsParams` | Mise à jour abonnement |
| `TRY_SELECT_DEPOSIT` | `age: number` | Tentative de sélection dépôt |
| `VALIDATE_REACTION` | `offerId: number`, `reactionType: ReactionTypeEnum`, `from: ReactionFromEnum`, `userId?: number` | Validation d'une réaction |

---

## 3. AppsFlyer - Campaign Events

### 3.1 Liste Complète des Events AppsFlyer

| Event | Valeur | Description |
|-------|--------|-------------|
| `COMPLETE_REGISTRATION` | `af_complete_registration` | Inscription complète (conversion) |
| `COMPLETE_BOOK_OFFER` | `af_complete_book_offer` | Réservation d'offre complète (conversion) |
| `OPEN_APP` | `af_open_app` | Ouverture de l'application |
| `UNDERAGE_USER` | `af_underage_user` | Utilisateur mineur détecté |

**Configuration** : `src/libs/campaign/events.ts`

---

## 4. Batch - Push Notification Events

### 4.1 Liste Complète des Events Batch

| Event | Valeur | Description |
|-------|--------|-------------|
| `hasBooked` | `has_booked` | L'utilisateur a effectué une réservation |
| `hasSeenAllTheHomepage` | `has_seen_all_the_homepage` | L'utilisateur a vu toute la homepage |
| `hasSeenBookingPage` | `has_seen_booking_page` | L'utilisateur a vu la page de réservation |
| `hasSeenBookOfferForSurvey` | `has_seen_book_offer_for_survey` | L'utilisateur a vu une offre livre (enquête) |
| `hasSeenCinemaOfferForSurvey` | `has_seen_cinema_for_survey` | L'utilisateur a vu une offre cinéma (enquête) |
| `hasSeenConcertForSurvey` | `has_seen_concert_for_survey` | L'utilisateur a vu un concert (enquête) |
| `hasSeenCulturalVisitForSurvey` | `has_seen_cultural_for_survey` | L'utilisateur a vu une visite culturelle (enquête) |
| `hasSeenEnoughHomeContent` | `has_seen_enough_home_content` | L'utilisateur a vu assez de contenu home |
| `hasSeenOffer` | `has_seen_offer` | L'utilisateur a vu une offre |
| `hasSeenOfferForSurvey` | `has_seen_offer_for_survey` | L'utilisateur a vu une offre (enquête) |
| `hasSeenVenueForSurvey` | `has_seen_venue_for_survey` | L'utilisateur a vu un lieu (enquête) |
| `hasValidatedAccount` | `has_validated_account` | L'utilisateur a validé son compte |
| `hasValidatedEligibleAccount` | `has_validated_eligible_account` | L'utilisateur a validé un compte éligible |
| `hasValidatedSubscription` | `has_validated_subscription` | L'utilisateur a validé son abonnement |
| `screenViewAccountCreated` | `screen_view_account_created` | Écran compte créé affiché |
| `screenViewComeBackLater` | `screen_view_come_back_later` | Écran revenir plus tard affiché |
| `screenViewExpiredOrLostId` | `screen_view_expired_or_lost_id` | Écran ID expiré/perdu affiché |
| `screenViewVerifyEligibility` | `screen_view_verify_eligiblity` | Écran vérification éligibilité affiché |

**Configuration** : `src/libs/react-native-batch/enums.ts`

---

## 5. Algolia Analytics

### 5.1 Tracking Algolia

L'analytics Algolia suit principalement les interactions de recherche :

- **logOfferConversion** : Conversion d'une offre depuis la recherche
- **logClickOnOffer** : Clic sur une offre dans les résultats
- **logClickOnVenue** : Clic sur un lieu dans les résultats

**Configuration** : `src/libs/algolia/analytics/`

---

## 6. Paramètres Communs

### 6.1 Paramètres de Navigation & Contexte

| Paramètre | Type | Description |
|-----------|------|-------------|
| `from` | `Referrals` | Provenance de l'utilisateur (voir section 7.1) |
| `moduleId` | `string` | Identifiant du module de contenu |
| `moduleName` | `string` | Nom du module de contenu |
| `homeEntryId` | `string` | Identifiant de l'entrée homepage |
| `searchId` | `string` | Identifiant de session de recherche |
| `playlistType` | `PlaylistType` | Type de playlist d'offres (voir section 7.3) |

### 6.2 Paramètres d'Offres & Lieux

| Paramètre | Type | Description |
|-----------|------|-------------|
| `offerId` | `number` | Identifiant de l'offre |
| `fromOfferId` | `number` | Identifiant de l'offre source (recommandations) |
| `fromMultivenueOfferId` | `number` | Identifiant de l'offre multi-venues source |
| `venueId` | `number` | Identifiant du lieu |
| `artistId` | `string` | Identifiant de l'artiste |
| `artistName` | `string` | Nom de l'artiste |

### 6.3 Paramètres de Recommandations

| Paramètre | Type | Description |
|-----------|------|-------------|
| `apiRecoParams` | `RecommendationApiParams` | Paramètres de l'algorithme de recommandation |
| `call_id` | `string` | Identifiant de l'appel de recommandation |

### 6.4 Paramètres de Recherche & Filtres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `query` | `string` | Texte de recherche |
| `searchLocationFilter` | `string` (JSON) | Filtre de localisation |
| `searchCategories` | `string` (JSON) | Catégories sélectionnées |
| `searchNativeCategories` | `string` (JSON) | Catégories natives sélectionnées |
| `searchGenreTypes` | `string` (JSON) | Types de genres sélectionnés |
| `searchMaxPrice` | `string` | Prix maximum |
| `searchMinPrice` | `string` | Prix minimum |
| `searchOfferIsDuo` | `boolean` | Filtre offres duo |
| `searchOfferIsFree` | `boolean` | Filtre offres gratuites |
| `searchDate` | `string` (JSON) | Filtre de date |
| `searchNbResults` | `number` | Nombre de résultats |
| `accessibilityFilter` | `string` | Filtre d'accessibilité |

### 6.5 Paramètres de Localisation

| Paramètre | Type | Description |
|-----------|------|-------------|
| `locationType` | `LocationMode` | Type de localisation : `AROUND_ME`, `EVERYWHERE`, `AROUND_PLACE` |

### 6.6 Métadonnées Analytics

| Paramètre | Type | Description |
|-----------|------|-------------|
| `index` | `number` | Position dans une liste |
| `position` | `number` | Position d'un item |
| `page` | `number` | Numéro de page |

---

## 7. Types et Enums

### 7.1 Type `Referrals` (Sources de provenance)

```typescript
type Referrals =
  | 'artist'
  | 'bookingimpossible'
  | 'chronicles'
  | 'deeplink'
  | 'endedbookings'
  | 'exclusivity'
  | 'highlightOffer'
  | 'home'
  | 'search'
  | 'searchAutoComplete'
  | 'searchLanding'
  | 'searchPlaylist'
  | 'searchVenuePlaylist'
  | 'setemail'
  | 'similar_offer'
  | 'trend_block'
  | 'venue'
  | 'venueMap'
  | 'venueList'
  | 'video'
  | 'videoModal'
  | 'video_carousel_block'
  | 'comingSoonOffer'
  | Lowercase<keyof AllNavParamList>
```

**Fichier source** : `src/features/navigation/RootNavigator/types.ts`

### 7.2 Enum `LocationMode`

```typescript
enum LocationMode {
  AROUND_ME = 'AROUND_ME',
  EVERYWHERE = 'EVERYWHERE',
  AROUND_PLACE = 'AROUND_PLACE',
}
```

### 7.3 Enum `PlaylistType`

```typescript
enum PlaylistType {
  SAME_CATEGORY_SIMILAR_OFFERS = 'sameCategorySimilarOffers',
  OTHER_CATEGORIES_SIMILAR_OFFERS = 'otherCategoriesSimilarOffers',
  SAME_ARTIST_PLAYLIST = 'sameArtistPlaylist',
  SEARCH_RESULTS = 'searchResults',
  TOP_OFFERS = 'topOffers',
}
```

**Fichier source** : `src/features/offer/enums.ts`

### 7.4 Enum `StepperOrigin`

```typescript
enum StepperOrigin {
  BOOKING = 'booking',
  DEACTIVATE_PROFILE_SUCCESS = 'DeactivateProfileSuccess',
  DEEPLINK = 'deeplink',
  FAVORITE = 'favorite',
  FORGOTTEN_PASSWORD = 'forgottenPassword',
  HOME = 'home',
  LOGIN = 'login',
  NOTIFICATION = 'notification',
  OFFER = 'offer',
  ONBOARDING_GENERAL_PUBLIC_WELCOME = 'OnboardingGeneralPublicWelcome',
  ONBOARDING_NOT_ELIGIBLE = 'onboardingNotEligible',
  ONBOARDING_WELCOME = 'onboardingWelcome',
  PROFILE = 'profile',
  RESET_PASSWORD_EMAIL_SENT = 'resetPasswordEmailSent',
  SIGNUP = 'signup',
  THEMATIC_HOME = 'thematicHome',
  TUTORIAL = 'Tutorial',
  VALIDATE_EMAIL_CHANGE = 'validateEmailChange',
  VERIFY_ELIGIBILITY = 'verifyEligibility',
}
```

**Fichier source** : `src/features/navigation/RootNavigator/types.ts`

### 7.5 Type `SSOType`

```typescript
type SSOType = 'SSO_login' | 'SSO_signup'
```

### 7.6 Type `ShareAppModalType`

Utilisé pour identifier le type de modale de partage.

---

## 8. Fichiers Sources

### 8.1 Configuration Firebase Analytics

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `src/libs/firebase/analytics/events.ts` | 225 | Définition des 204 events Firebase |
| `src/libs/firebase/analytics/types.ts` | 18 | Interfaces TypeScript pour l'analytics provider |
| `src/libs/firebase/analytics/analytics.ts` | - | Wrapper principal Firebase Analytics |
| `src/libs/firebase/analytics/provider.ts` | - | Provider avec support natif/web |

### 8.2 Implémentation Tracking

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `src/libs/analytics/logEventAnalytics.ts` | 748 | Toutes les fonctions de tracking Firebase (204) |
| `src/libs/analytics/provider.ts` | - | Provider wrapper centralisé |
| `src/libs/analytics/types.ts` | - | Définitions de types |
| `src/libs/analytics/utils.ts` | - | Fonctions utilitaires pour paramètres |

### 8.3 Tracking Manager (Système Centralisé)

| Fichier | Description |
|---------|-------------|
| `src/shared/tracking/TrackingManager.ts` | Gestionnaire centralisé avec système de buffer |
| `src/shared/tracking/usePageTracking.ts` | Hook React pour tracking de pages |
| `src/shared/analytics/logViewItem.ts` | Implémentation tracking VIEW_ITEM |

### 8.4 Campaign & Batch

| Fichier | Description |
|---------|-------------|
| `src/libs/campaign/campaignTracker.ts` | Intégration AppsFlyer |
| `src/libs/campaign/events.ts` | 4 events AppsFlyer |
| `src/libs/campaign/types.ts` | Interface CampaignTracker |
| `src/libs/react-native-batch/enums.ts` | 16 events Batch |

### 8.5 Algolia Analytics

| Fichier | Description |
|---------|-------------|
| `src/libs/algolia/analytics/initAlgoliaAnalytics.ts` | Initialisation Algolia Analytics |
| `src/libs/algolia/analytics/logOfferConversion.ts` | Tracking conversions d'offres |
| `src/libs/algolia/analytics/logClickOnOffer.ts` | Tracking clics sur offres |
| `src/libs/algolia/analytics/logClickOnVenue.ts` | Tracking clics sur lieux |

### 8.6 Documentation & Scripts

| Fichier | Description |
|---------|-------------|
| `doc/development/how-to/trackers.md` | Documentation d'ajout de trackers |
| `scripts/add_tracker.py` | Script d'automatisation pour nouveaux trackers |

---

## 9. Règles de Nommage Firebase

### 9.1 Contraintes

- **Longueur maximale** : 40 caractères
- **Format** : Alphanumériques + underscores uniquement
- **Début** : Doit commencer par une lettre
- **Préfixes réservés** : Ne pas utiliser `firebase_`, `google_`, `ga_`
- **Convention** : PascalCase (ex: `ConsultOffer`, `BookingConfirmation`)

### 9.2 Validation

```typescript
const FIREBASE_NAME_FORMAT = /^[a-zA-Z][0-9a-zA-Z_]+$/

function validateAnalyticsEvent(eventName: string): boolean {
  if (eventName.length > 40) return false
  for (const reservedKeyword of ['firebase_', 'google_', 'ga_']) {
    if (eventName.startsWith(reservedKeyword)) return false
  }
  return eventName.match(FIREBASE_NAME_FORMAT) !== null
}
```

---

## 10. Ajout d'un Nouveau Tracker

### 10.1 Avec le Script Automatisé

```bash
# Pour Firebase Analytics
yarn add:tracker --provider=firebase NouveauTracker

# Le script génère automatiquement :
# - Ajout dans events.ts
# - Fonction dans logEventAnalytics.ts
# - Mocks pour les tests
```

### 10.2 Manuellement

1. **Ajouter l'event** dans `src/libs/firebase/analytics/events.ts`
2. **Créer la fonction** dans `src/libs/analytics/logEventAnalytics.ts`
3. **Ajouter les mocks** pour les tests
4. **Tester** avec Firebase DebugView

**Documentation complète** : `doc/development/how-to/trackers.md`

---

## 11. Testing Analytics

### 11.1 Firebase DebugView

**iOS** :
```bash
xcrun simctl spawn booted log config --mode "level:debug" --subsystem com.google.firebase.analytics
```

**Android** :
```bash
adb shell setprop debug.firebase.analytics.app <package_name>
adb shell setprop log.tag.FA VERBOSE
```

**Web** :
```javascript
// Dans la console navigateur
window.gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true })
```

---

## 12. Statistiques

| Métrique | Valeur |
|----------|--------|
| **Total Events Firebase** | 204 |
| **Total Events AppsFlyer** | 4 |
| **Total Events Batch** | 16 |
| **Total Providers** | 4 (Firebase, AppsFlyer, Batch, Algolia) |
| **Lignes de code tracking** | ~748 (logEventAnalytics.ts) |
| **Paramètres communs** | ~40+ types différents |
| **Types Referrals** | 25+ valeurs possibles |

---

## 13. Remarques Importantes

### 13.1 Système de Buffer

Le système utilise un **TrackingManager centralisé** avec buffer pour garantir la fiabilité de l'envoi des events même en cas de problèmes réseau.

### 13.2 Support Multiplateforme

Tous les trackers supportent :
- **iOS** (natif)
- **Android** (natif)
- **Web** (Firebase Web SDK)

### 13.3 Conformité RGPD

Le système respecte les choix de l'utilisateur concernant :
- Cookies analytics
- Tracking de campagnes (AppsFlyer)
- Notifications push (Batch)

---

**Fin du document**

---

*Ce document a été généré automatiquement en analysant le codebase Pass Culture App Native.*
