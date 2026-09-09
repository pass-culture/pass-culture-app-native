FROM scratch AS netskope-certs

FROM node:25-bookworm
COPY --from=netskope-certs . /usr/local/share/ca-certificates/
RUN update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /app
COPY . .

RUN yarn install --immutable
RUN yarn playwright install --with-deps chromium

CMD ["yarn", "test:e2e:web"]
