import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import fetch from 'fetch';
import search from '../utils/mu-search';
import Snapshot from '../utils/snapshot';

export default class SearchToezichtRoute extends Route {
  @service currentSession;

  queryParams = {
    searchType: { refreshModel: true },
    searchString: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true }
  }

  lastParams = null;

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  async model(params){
    const filter = {};

    console.log( params.searchType );

    this.lastParams.stageLive( params );
    if( !this.lastParams.fieldChanged( "page" ) ) {
      params.page = 0;
      // this.lastParams.stage( params );
    }

    filter[`:sqs:data`] = isEmpty(params.searchString) ? "*" : params.searchString;
    if( params.searchType ) filter["decisionType"] = params.searchType;

    this.lastParams.commit();

    return search('submissions', params.page, params.size, filter, function(item) {
      item.attributes.id = item.id;
      return item.attributes;
    });
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    if( controller.page != this.lastParams.committed.page )
      controller.set('page', this.lastParams.committed.page );
  }

  @action
  loading(/* transition, origin */) {
    // Cancel default loading template
    return;
  }
}
