HomeBanner
 when feature flag showRemoteGenericBanner is enable
- should display force update banner


 user is not logged in
- should display SignupBanner when user is not logged in


 user is logged in
- should display activation banner with BicolorUnlock icon when banner api call return activation banner
- should display activation banner with ArrowAgain icon when banner api call return retry_identity_check_banner
- should display activation banner with BirthdayCake icon when banner api call return transition_17_18_banner
- should notify errors when query fails


 <HomeBanner/>

