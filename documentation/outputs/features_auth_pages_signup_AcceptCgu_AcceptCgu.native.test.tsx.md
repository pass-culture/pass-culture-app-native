AcceptCgu
 <AcceptCgu/>
- should render correctly
- should render correctly for SSO subscription
- should redirect to the "CGU" page
- should redirect to the "Charte des données personnelles" page
- should disable the button if the data charted is not checked
- should log analytics when pressing on signup button
- should open reCAPTCHA challenge's modal when pressing on signup button
- should call API to create user account when reCAPTCHA challenge is successful
- should call API with previous marketing data to create classic account
- should call API with marketing email subscription information to create SSO account
- should not take into account previous marketing data for SSO account in CGU page
- should display error message when API call to create user account fails
- should NOT call API to create user account when reCAPTCHA challenge was failed
- should NOT call API to create user account when reCAPTCHA token has expired

