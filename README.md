# frontend-toezicht-abb

Frontend of the Toezicht ABB application

## Environment variables

The [static-file-service](https://github.com/mu-semtech/static-file-service?tab=readme-ov-file#how-to-configure-an-ember-application-at-runtime-using-environment-variables) docker image (which we use to host the frontend) supports configuring environment variables. The following options are available.

### ACM/IDM

| Name                               | Description                                                                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EMBER_ACMIDM_CLIENT_ID`           | The unique client id for a specific environment                                                                                                          |
| `EMBER_ACMIDM_AUTH_URL`            | The URL where users will be redirected to when they want to log in                                                                                       |
| `EMBER_ACMIDM_AUTH_REDIRECT_URL`   | The callback URL that ACM/IDM will use after the user logs in successfully                                                                               |
| `EMBER_ACMIDM_LOGOUT_URL`          | The URL where users will be redirected to when they want to log out                                                                                      |
