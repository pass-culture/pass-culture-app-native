export declare const TEST_HTML = "<!doctype html>\n<html lang=\"fr\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>pass Culture</title>\n    <meta name=\"title\" content=\"pass Culture\"/>\n    <meta name=\"description\"\n          content=\"Dispositif port\u00E9 par le minist\u00E8re de la Culture, a pour but de faciliter l'acc\u00E8s des jeunes de 18 ans \u00E0 la culture en leur offrant un cr\u00E9dit de 300\u20AC \u00E0 d\u00E9penser sur l'application pass Culture.\"/>\n    <meta name=\"author\" content=\"pass Culture\"/>\n    <meta property=\"og:type\" content=\"website\"/>\n    <meta property=\"og:url\" content=\"https://app.testing.passculture.team\"/>\n    <meta property=\"og:title\" content=\"pass Culture\"/>\n    <meta property=\"og:description\"\n          content=\"Dispositif port\u00E9 par le minist\u00E8re de la Culture, a pour but de faciliter l'acc\u00E8s des jeunes de 18 ans \u00E0 la culture en leur offrant un cr\u00E9dit de 300\u20AC \u00E0 d\u00E9penser sur l'application pass Culture.\"/>\n    <meta property=\"og:image\" content=\"https://app.testing.passculture.team/images/app-icon-512px.png\"/>\n    <meta property=\"og:image:alt\" content=\"pass Culture\"/>\n    <meta property=\"og:locale\" content=\"fr_FR\"/>\n    <meta property=\"og:site_name\" content=\"pass Culture\"/>\n    <meta name=\"twitter:card\" content=\"app\"/>\n    <meta name=\"twitter:url\" content=\"https://app.testing.passculture.team\"/>\n    <meta name=\"twitter:title\" content=\"pass Culture\"/>\n    <meta name=\"twitter:description\"\n          content=\"Dispositif port\u00E9 par le minist\u00E8re de la Culture, a pour but de faciliter l'acc\u00E8s des jeunes de 18 ans \u00E0 la culture en leur offrant un cr\u00E9dit de 300\u20AC \u00E0 d\u00E9penser sur l'application pass Culture.\"/>\n    <meta name=\"twitter:image\" content=\"https://app.testing.passculture.team/images/app-icon-512px.png\"/>\n    <meta name=\"twitter:image:alt\" content=\"pass Culture\"/>\n    <meta name=\"twitter:site\" content=\"@pass_Culture\"/>\n    <meta name=\"twitter:app:country\" content=\"FR\"/>\n    <meta name=\"twitter:app:name:iphone\" content=\"pass Culture\"/>\n    <meta name=\"twitter:app:id:iphone\" content=\"1557887412\"/>\n    <meta name=\"twitter:app:url:iphone\" content=\"passculture://https://app.testing.passculture.team\"/>\n    <meta name=\"twitter:app:name:ipad\" content=\"pass Culture\"/>\n    <meta name=\"twitter:app:id:ipad\" content=\"1557887412\"/>\n    <meta name=\"twitter:app:url:ipad\" content=\"passculture://https://app.testing.passculture.team\"/>\n    <meta name=\"twitter:app:name:googleplay\" content=\"pass Culture\"/>\n    <meta name=\"twitter:app:id:googleplay\" content=\"app.passculture.testing\"/>\n    <meta name=\"twitter:app:url:googleplay\" content=\"passculture://https://app.testing.passculture.team\"/>\n    <meta property=\"al:ios:app_name\" content=\"pass Culture\"/>\n    <meta property=\"al:ios:app_store_id\" content=\"1557887412\"/>\n    <meta property=\"al:ios:url\" content=\"passculture://https://app.testing.passculture.team\"/>\n    <meta property=\"al:android:url\" content=\"passculture://https://app.testing.passculture.team\">\n    <meta property=\"al:android:app_name\" content=\"pass Culture\"/>\n    <meta property=\"al:android:package\" content=\"app.passculture.testing\"/>\n  </head>\n  <body>\n    <p>Hello world</p>\n  </body>\n</html>";
export declare const OFFER_RESPONSE_SNAP: {
    id: number;
    accessibility: {
        audioDisability: boolean;
        mentalDisability: boolean;
        motorDisability: boolean;
        visualDisability: boolean;
    };
    description: string;
    expenseDomains: string[];
    isDigital: boolean;
    isDuo: boolean;
    isEducational: boolean;
    name: string;
    subcategoryId: string;
    isReleased: boolean;
    isExpired: boolean;
    isForbiddenToUnderage: boolean;
    isSoldOut: boolean;
    stocks: {
        id: number;
        beginningDatetime: string;
        price: number;
        isBookable: boolean;
        isExpired: boolean;
        isForbiddenToUnderage: boolean;
        isSoldOut: boolean;
    }[];
    image: {
        url: string;
        credit: string;
    };
    venue: {
        id: number;
        address: string;
        city: string;
        offerer: {
            name: string;
        };
        name: string;
        postalCode: string;
        publicName: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        isPermanent: boolean;
    };
    withdrawalDetails: string;
};
export declare const VENUE_RESPONSE_SNAP: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    city: string;
    publicName: string;
    isVirtual: boolean;
    isPermanent: boolean;
    withdrawalDetails: string;
    address: string;
    postalCode: string;
    bannerMeta: {
        image_credit: string;
    };
    description: string;
    accessibility: {
        audioDisability: boolean;
        mentalDisability: boolean;
        motorDisability: boolean;
        visualDisability: boolean;
    };
    contact: {
        email: string;
        phoneNumber: string;
        website: string;
    };
};
export declare const VENUE_RESPONSE_ALTERNATIVE_SNAP: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    city: string;
    isVirtual: boolean;
    isPermanent: boolean;
    withdrawalDetails: string;
    address: string;
    postalCode: string;
    description: string;
    accessibility: {
        audioDisability: boolean;
        mentalDisability: boolean;
        motorDisability: boolean;
        visualDisability: boolean;
    };
    contact: {
        email: string;
        phoneNumber: string;
        website: string;
    };
};
