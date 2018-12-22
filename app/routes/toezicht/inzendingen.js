import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'inzending-voor-toezicht',
  mergeQueryOptions() {
    return {
      include: [
        'bestuurseenheid.classificatie',
        'status',
      ].join(',')
    };
  }
});
