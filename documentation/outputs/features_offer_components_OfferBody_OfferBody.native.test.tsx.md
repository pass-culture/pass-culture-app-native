OfferBody
 Tags section
- should display tags
- should display vinyl tag


 Venue button section
- should display venue button when this is not a cinema offer
- should not display venue button when venue is not permanent
- should not display venue button when wipIsOpenToPublic feature flag activated and isOpenToPublic is false
- should not display venue button when this is a cinema offer


 Summary info section
- should display duo info
- should not display duo info


 Venue section
- should display venue section
- should display venue distance tag when user share his position
- should not display venue distance tag when user not share his position


 Venue button section & Summary info section
- should display both section when this is not a cinema offer
- should not display both section
- should not display top separator between this two section
- should display top separator above summary info list when venue button is not displayed
- should not display top separator when there are no summaryInfo items to display


 About section
- should display about section
- should not display about section


 ProposedBy section
- should display proposed section
- should not display proposed section
- should redirect to venue page when pressing proposed by section when venue is permanent
- should not redirect to venue page when pressing proposed by section when venue is not permanent


 MovieScreeningCalendar
- should render <MovieScreeningCalendar /> when offer is a movie screening


 <OfferBody />
- should display offer as a title
- should display artists
- should not display artists when array is empty
- should display prices
- should not display prices when the offer is free
- should redirect to artist page when FF is enabled
- should not redirect to artist page when FF is enabled and artist has less than 2 offers
- should log ConsultArtist when pressing artist name button and FF is enabled
- should not log ConsultArtist when pressing artist name if offer has several artists and FF is enabled
- should not redirect to artist page when FF is disabled

