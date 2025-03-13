import Component from '@glimmer/component';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import config from 'frontend-toezicht-abb/config/environment';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';

export default class LoginButton extends Component {
  get acmidmLogin() {
    return hasAcmIdmConfig();
  }

  get acmidmLoginUrl() {
    return buildUrlFromConfig(config.acmidm);
  }

  <template>
    {{#if this.acmidmLogin}}
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

// const Link = <template>
//   <AuLinkExternal
//     @skin={{if @isCompact "link" "primary"}}
//     @icon="login"
//     @iconAlignment="left"
//     @newTab={{false}}
//   >
//     Aanmelden
//   </AuLinkExternal>
// </template>
function hasAcmIdmConfig() {
  // TODO, check all keys
  return !config.acmidm.apiKey.startsWith('{{');
}
