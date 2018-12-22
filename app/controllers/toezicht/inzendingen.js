import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: service(),
  page: 0,
  size: 20,
  sort: '-sent-date',
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('toezicht.inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.inzendingen.index';
  })
});
