AccountStatusScreenHandler
 <AccountStatusScreenHandler />
- should display SuspendedAccountUponUserRequest component if account is suspended upon user request
- should display SuspiciousLoginSuspendedAccount component if account is suspended for suspicious login reported by user
- should display FraudulentSuspendedAccount component if account is suspended for fraud
- should redirect to home if account is not suspended
- should call sign out function on component unmount
- should not call sign out function if user is redirect to reactivation success screen

