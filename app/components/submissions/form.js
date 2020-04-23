import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import {warn} from '@ember/debug';

import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {task} from 'ember-concurrency-decorators';

const RDF = new rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FORM = new rdflib.Namespace("http://lblod.data.gift/vocabularies/forms/");

export default class SubmissionsFormComponent extends Component {
  @service store;

  @task
  *loadData() {
    const submission = yield this.args.submission;
    // Fetch data from backend
    const submissionDocument = yield submission.submissionDocument;

    if (!submissionDocument) {
      warn('No submission document, Transitioning to index.');
      this.transitionTo('supervision.submissions');
    }

    const response = yield fetch(`/submission-forms/${submissionDocument.id}`);
    const {source, additions, removals, meta, form} = yield response.json();

    // Prepare data in forking store

    const formStore = new ForkingStore();

    const metaGraph = new rdflib.NamedNode("http://data.lblod.info/metagraph");
    formStore.parse(meta, metaGraph, "text/turtle");
    const formGraph = new rdflib.NamedNode("http://data.lblod.info/form");
    formStore.parse(form, formGraph, "text/turtle");

    const sourceGraph = new rdflib.NamedNode(`http://data.lblod.info/submission-document/data/${submissionDocument.id}`);
    if (removals || additions) {
      formStore.loadDataWithAddAndDelGraph(source, sourceGraph, additions, removals, "text/turtle");
    } else {
      formStore.parse(source, sourceGraph, "text/turtle");
    }

    const graphs = {formGraph, sourceGraph, metaGraph};
    const formNode = formStore.any(undefined, RDF("type"), FORM("Form"), formGraph);

    return [{
      form: formNode,
      formStore: formStore,
      graphs: graphs,
      sourceNode: new rdflib.NamedNode(submissionDocument.uri)
    }];
  }
}