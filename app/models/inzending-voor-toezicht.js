import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';

export default Model.extend({
  created: attr('datetime'),
  modified: attr('datetime'),
  sentDate: attr('datetime'),
  description: attr(),
  remark: attr(),
  temporalCoverage: attr(),
  businessIdentifier: attr(),
  businessName: attr(),
  dateOfEntryIntoForce: attr('date'),
  endDate: attr('date'),
  hasExtraTaxRates: attr(),
  agendaItemCount: attr(),
  sessionDate: attr('datetime'),
  decisionDateOtherAdministration: attr('date'),
  decisionSummary: attr(),
  dateHandover: attr('date'),
  text: attr(),
  datePublicationWebapp: attr('date'),
  status: belongsTo('document-status', { inverse: null }),
  lastModifier: belongsTo('gebruiker', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null }),
  formSolution: belongsTo('form-solution', { inverse: 'inzendingVoorToezicht' }),
  inzendingType: belongsTo('toezicht-inzending-type', { inverse: null }),
  besluitType: belongsTo('besluit-type', { inverse: null }),
  regulationType: belongsTo('toezicht-regulation-type', { inverse: null }),
  bestuursorgaan: belongsTo('bestuursorgaan', { inverse: null }),
  authenticityType: belongsTo('toezicht-document-authenticity-type', { inverse: null }),
  accountAcceptanceStatus: belongsTo('toezicht-account-acceptance-status', { inverse: null }),
  deliveryReportType: belongsTo('toezicht-delivery-report-type', { inverse: null }),
  fiscalPeriod: belongsTo('toezicht-fiscal-period', { inverse: null }),
  nomenclature: belongsTo('toezicht-nomenclature', { inverse: null }),
  taxType: belongsTo('toezicht-tax-type', { inverse: null }),
  files: hasMany('file', { inverse: null }),
  taxRates: hasMany('tax-rate', { inverse: null }),
  melding: belongsTo('inzending-voor-toezicht-melding', { inverse: 'inzendingVoorToezicht' }),
  fileAddresses: hasMany('file-address', { inverse: null}),

  isRegulation: computed(function(){
    return this.get('besluitType.uri') === 'http://data.lblod.info/DecisionType/5b3955cc006323233e711c482f3a6bf39a8d3eba6bbdb2c672bdfcf2b2985b03';
  })
});
