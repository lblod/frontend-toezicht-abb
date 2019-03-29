FROM madnificent/ember:3.4.1 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN DEPLOY_ENV=production ember build -prod

FROM semtech/ember-proxy-service:1.4.0

ENV STATIC_FOLDERS_REGEX "^/(assets|font|files)/"

COPY ./proxy/torii-authorization.conf /config/torii-authorization.conf

COPY --from=builder /app/dist /app
