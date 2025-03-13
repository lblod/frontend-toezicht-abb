import Component from '@glimmer/component';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import config from 'frontend-toezicht-abb/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';

export default class LoginButton extends Component {
  get hasAcmIdmConfig() {
  // We assume if one env key is configured, all of them are.
  return !config.acmidm.clientId.startsWith('{{');
  }

  get acmidmLoginUrl() {
    return buildUrlFromConfig(config.acmidm);
  }

  <template>
    {{#if this.hasAcmIdmConfig}}
      <AuLinkExternal
        @skin={{unless @isCompact "button"}}
        @icon="login"
        @iconAlignment="left"
        @newTab={{false}}
        href={{this.acmidmLoginUrl}}
      >
        Aanmelden
      </AuLinkExternal>
    {{else}}
      <AuLink
        @route="mock-login"
        @skin={{unless @isCompact "button"}}
        @icon="login"
        @iconAlignment="left"
      >
        Aanmelden
      </AuLink>
    {{/if}}
  </template>
}
