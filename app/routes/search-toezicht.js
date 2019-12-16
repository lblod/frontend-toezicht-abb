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

  lastParams = null;

  async model(params){
    const filter = {};

    if( !this.lastParams )
      this.lastParams = params;

    if( this.lastParams.searchType != params.searchType
        || this.lastParams.searchString != params.searchString
        || this.lastParams.size != params.size )
      params.page = 0;

    filter[`:sqs:data`] = isEmpty(params.searchString) ? "*" : params.searchString;
    if( params.searchType ) filter["decisionType"] = params.searchType;

    this.lastParams = Object.assign(params,{});

    return search('submissions', params.page, params.size, filter, function(item) {
      item.attributes.id = item.id;
      return item.attributes;
    });
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    if( controller.page != this.lastParams.page )
      controller.set('page', this.lastParams.page);
  }

  @action
  loading(/* transition, origin */) {
    // Cancel default loading template
    return;
  }
}
