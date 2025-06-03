InternalTouchableLink
 <InternalTouchableLink />
- should navigate to right screen with expected params (nominal case)
- should push right screen with expected params if withPush={true}
- should push screen only once in case of press spamming
- should navigate using navigateFromRef if fromRef={true}
- should push using pushFromRef if withPush={true} and fromRef={true}
- should not navigate to right screen with expected params when enableNavigate is false

