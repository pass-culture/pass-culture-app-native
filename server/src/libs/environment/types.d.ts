export interface EnvConfig {
    [name: string]: string | undefined;
}
export interface Environment {
    ENV: string;
    APP_PUBLIC_URL: string;
    APP_PROXY_URL: string;
    API_BASE_URL: string;
    API_BASE_PATH_NATIVE_V1: string;
    DEEPLINK_PROTOCOL: string;
    PROXY_CACHE_CONTROL: string;
}
