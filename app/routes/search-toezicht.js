import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import fetch from 'fetch';
import search from '../utils/mu-search';

export default class SearchToezichtRoute extends Route {
  @service currentSession;

  queryParams = {
    searchType: { refreshModel: true },
    searchString: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true }
  }

  async model(params){
    const filter = {};

    filter[`:sqs:data`] = isEmpty(params.searchString) ? "*" : params.searchString;
    if( params.searchType ) filter["decisionType"] = params.searchType;

    return search('submissions', params.page, params.size, filter, function(item) {
      item.attributes.id = item.id;
      return item.attributes;
    });
  }

  @action
  loading(/* transition, origin */) {
    // Cancel default loading template
    return;
  }
}
