# TODO

## Links

- [PC-TicketNumber](https://passculture.atlassian.net/browse/PC-TicketNumber)
- [MobTime](https://mobtime.hadrienmp.fr/mob/pass-culture)

---

## Tasks

Listes des tests a fix :

- [x] FAIL src/features/bookings/pages/BookingDetails/BookingDetails.web.test.tsx
- [x] FAIL src/features/profile/pages/PersonalData/PersonalData.web.test.tsx
- [x] FAIL src/features/forceUpdate/pages/ForceUpdate.web.test.tsx
- [x] FAIL src/features/bookings/pages/BookingDetails/BookingDetails.web.test.tsx
- [x] FAIL src/features/search/pages/modals/LocationModal/LocationModal.web.test.tsx
- [x] FAIL src/features/offer/pages/Offer/Offer.web.test.tsx
- [x] FAIL src/features/auth/pages/login/Login.web.test.tsx
- [x] FAIL src/features/share/pages/WebShareModal.web.test.tsx
- [x] FAIL src/features/auth/pages/signup/SignupForm.web.test.tsx
- [x] FAIL src/features/search/components/SearchResults/SearchResults.web.test.tsx

---

Détails

```
Summary of all failing tests
 FAIL  src/features/profile/pages/PersonalData/PersonalData.web.test.tsx (30.694 s, 269 MB heap size)
  ● <PersonalData/> › Accessibility › should not have basic accessibility issues

    Oh no! Your test called the following console method:
      * warn (1 call)
        > Call 0: "[MSW] Warning: captured a request without a matching request handler:...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/forceUpdate/pages/ForceUpdate.web.test.tsx (31.989 s, 268 MB heap size)
  ● <ForceUpdate/> › Accessibility › should not have basic accessibility issues

    Oh no! Your test called the following console method:
      * warn (1 call)
        > Call 0: "[MSW] Warning: captured a request without a matching request handler:...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/bookings/pages/BookingDetails/BookingDetails.web.test.tsx (35.694 s, 276 MB heap size)
  ● BookingDetails › Accessibility › should not have basic accessibility issues

    Oh no! Your test called the following console method:
      * warn (1 call)
        > Call 0: "[MSW] Warning: captured a request without a matching request handler:...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/search/pages/modals/LocationModal/LocationModal.web.test.tsx (13.029 s, 297 MB heap size)
  ● <LocationModal/> › should close the modal when clicking close button

    Oh no! Your test called the following console method:
      * error (1 call)
        > Call 0: "Warning: An update to %s inside a test was not wrapped in act(...)...., "LocationModal", "...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/offer/pages/Offer/Offer.web.test.tsx (40.508 s, 280 MB heap size)
  ● <Offer/> › Accessibility › should not have basic accessibility issues

    Oh no! Your test called the following console method:
      * warn (1 call)
        > Call 0: "[MSW] Warning: captured a request without a matching request handler:...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/auth/pages/login/Login.web.test.tsx (32.35 s, 375 MB heap size)
  ● <Login/> › should display forced login help message when the query param is given

    Oh no! Your test called the following console method:
      * error (1 call)
        > Call 0: "Warning: An update to %s inside a test was not wrapped in act(...)...., "ForwardRef(WithRefTextInput)", "...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/share/pages/WebShareModal.web.test.tsx (26.405 s, 384 MB heap size)
  ● <WebShareModal/> › should open the email on the email button click

    Oh no! Your test called the following console method:
      * warn (2 calls)
        > Call 0: "[MSW] Warning: captured a request without a matching request handler:...
        > Call 1: "[MSW] Warning: captured a request without a matching request handler:...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

 FAIL  src/features/auth/pages/signup/SignupForm.web.test.tsx (51.401 s, 397 MB heap size)
  ● <SignupForm/> › Accessibility › should not have basic accessibility issues for SetPassword

    thrown: "Exceeded timeout of 10000 ms for a test.
    Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."

      36 |     })
      37 |
    > 38 |     it.each`
         |     ^
      39 |       stepIndex | component
      40 |       ${1}      | ${'SetEmail'}
      41 |       ${2}      | ${'SetPassword'}

      at node_modules/jest-each/build/bind.js:45:11
          at Array.forEach (<anonymous>)
      at src/features/auth/pages/signup/SignupForm.web.test.tsx:38:5
      at describe (src/features/auth/pages/signup/SignupForm.web.test.tsx:23:3)
      at Object.describe (src/features/auth/pages/signup/SignupForm.web.test.tsx:22:1)

 FAIL  src/features/search/components/SearchResults/SearchResults.web.test.tsx (21.418 s, 373 MB heap size)
  ● SearchResults component › should render correctly

    Oh no! Your test called the following console method:
      * error (1 call)
        > Call 0: "Warning: An update to %s inside a test was not wrapped in act(...)...., "LocationModal", "...

      at createComplaint (node_modules/console-fail-test/src/complaining.js:30:19)
      at node_modules/console-fail-test/src/cft.js:36:59
      at afterEachCallback (node_modules/console-fail-test/src/environments/jest.js:22:39)
      at Object.<anonymous> (node_modules/console-fail-test/src/environments/jest.js:15:9)

```

---

## Tasks for another US

- [ ] Tester de mettre les useFakeTimers('modern')
