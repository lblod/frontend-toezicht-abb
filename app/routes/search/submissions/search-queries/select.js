import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import {
  formStoreToQueryParams,
  retrieveFormData,
  retrieveSourceData,
} from '../../../../utils/filter-form-helpers';
import { FILTER_FORM_UUID } from '../../../../components/search-queries/filter-form';

export default class SearchSubmissionSearchQueriesSelectRoute extends Route {
  @service store;
  @service router;

  async model(params) {
    const store = new ForkingStore();
    const query = await this.store.findRecord('search-query', params.id);
    await retrieveFormData(`/search-query-forms/${FILTER_FORM_UUID}`, store);
    const node = await retrieveSourceData(
      query.uri,
      `/search-queries/${query.id}`,
      store,
    );
    return {
      store,
      node,
    };
  }

  afterModel(model) {
    const { store, node } = model;
    this.router.transitionTo(
      'search.submissions',
      formStoreToQueryParams(store, node),
    );
  }
}
