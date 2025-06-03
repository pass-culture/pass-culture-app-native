Stepper
 Stepper navigation
- should render correctly
- should display an error message if the identification step failed
- should stay on stepper when next_step is null and initialCredit is not between 0 and 300 euros
- should navigate to BeneficiaryAccountCreated when next_step is null and initialCredit is available
- should trigger StepperDisplayed tracker when route contains a from parameter and user has a step to complete
- should not trigger StepperDisplayed tracker when route does not contain a from parameter

