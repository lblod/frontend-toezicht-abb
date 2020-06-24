import Route from '@ember/routing/route';

import {inject as service} from '@ember/service';

export default class UserSearchQueriesRoute extends Route {
  @service currentSession;

  async model(){
    const user = this.currentSession.user;
    return user.searchQueries;
  }
}
