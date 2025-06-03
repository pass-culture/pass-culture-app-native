Login
 Login comes from adding an offer to favorite
- should redirect to Offer page when signin is successful
- should add the previous offer to favorites when signin is successful
- should log analytics when adding the previous offer to favorites
- should redirect to CulturalSurveyIntro instead of Offer when user needs to fill it


 Login from offer booking modal
- should redirect to the previous offer page and ask to open the booking modal


 Login with ReCatpcha
- should not open reCAPTCHA challenge modal before clicking on login button
- should open reCAPTCHA challenge modal when clicking on login button
- should disable login button when starting reCAPTCHA challenge
- should login user when reCAPTCHA challenge is successful
- should display error message on reCAPTCHA failure
- should not login user on reCAPTCHA failure
- should log to Sentry on reCAPTCHA failure
- should not log to Sentry on reCAPTCHA network error
- should precise when it is a network failure on reCAPTCHA failure
- should display error message when reCAPTCHA token has expired
- should not login user when reCAPTCHA token has expired


 <Login/>
- should render correctly when feature flag is enabled
- should sign in when "Se connecter" is clicked with device info
- should sign in when SSO button is clicked with device info
- should show snackbar when SSO login fails because account is invalid
- should redirect to signup form when SSO login fails because user does not exist
- should display suggestion with a corrected email when the email is mistyped
- should not open reCAPTCHA challenge modal when clicking on login button when feature flag is disabled
- should redirect to home WHEN signin is successful
- should redirect to NATIVE Cultural Survey WHEN signin is successful and user needs to fill cultural survey
- should redirect to home WHEN signin is successful and ENABLE_CULTURAL_SURVEY_MANDATORY enabled
- should not redirect to EighteenBirthday WHEN signin is successful and user has already seen eligible card and needs to see it
- should redirect to EighteenBirthday WHEN signin is successful and user has not seen eligible card and needs to see it
- should redirect to RecreditBirthdayNotification WHEN signin is successful and user has recreditAmountToShow not null
- should not redirect to RecreditBirthdayNotification WHEN signin is successful and user has recreditAmountToShow to null
- should redirect to SignupConfirmationEmailSent page WHEN signin has failed with EMAIL_NOT_VALIDATED code
- should redirect to AccountStatusScreenHandler WHEN signin is successful for inactive account
- should redirect to AccountStatusScreenHandler WHEN signin is successful for suspended account
- should redirect to AccountStatusScreenHandler WHEN signin is successful for suspended account upon user request
- should redirect to AccountStatusScreenHandler WHEN signin is successful for suspended account suspicious login report by user
- should redirect to AccountStatusScreenHandler WHEN signin is successful for waiting for anonymization account
- should show appropriate message if account is deleted
- should show appropriate message if account is anonymized
- should show email error message WHEN invalid e-mail format
- should show error message and error inputs WHEN signin has failed because of wrong credentials
- should show error message and error inputs WHEN signin has failed because of network failure
- should show specific error message when signin rate limit is exceeded
- should enable login button when both text inputs are filled
- should log analytics on render
- should log analytics when clicking on "Créer un compte" button
- should log analytics when signing in
- should log analytics when signing in with SSO
- should display forced login help message when the query param is given
- should log analytics when displaying forced login help message
- should not display the login help message when the query param is not given

