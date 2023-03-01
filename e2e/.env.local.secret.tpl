ENV=development

ANDROID=${ANDROID:-false}

PORT=6001
DATABASE_URL_TEST=postgresql://postgres:passq@pc-postgres-e2e/pass_culture
REDIS_URL=redis://pc-redis-e2e
EMAIL_BACKEND=pcapi.core.mails.backends.sendinblue.ToDevSendinblueBackend
IS_E2E_TESTS=1
RUN_ENV=tests
CORS_ALLOWED_ORIGINS_NATIVE=*

# secret below
END_TO_END_TESTS_EMAIL_ADDRESS=${END_TO_END_TESTS_EMAIL_ADDRESS}
SENDINBLUE_API_KEY=${SENDINBLUE_API_KEY}
