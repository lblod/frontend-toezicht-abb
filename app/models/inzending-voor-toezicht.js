import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  //--- attributes
  agendaItemCount: attr(),
  businessIdentifier: attr(),
  businessName: attr(),
  created: attr('datetime'),
  dateHandover: attr('date'),
  dateOfEntryIntoForce: attr('date'),
  datePublicationWebapp: attr('date'),
  decisionDateOtherAdministration: attr('date'),
  decisionSummary: attr(),
  description: attr(),
  endDate: attr('date'),
  hasExtraTaxRates: attr(),
  modified: attr('datetime'),
  remark: attr(),
  sentDate: attr('datetime'),
  sessionDate: attr('datetime'),
  temporalCoverage: attr(),
  text: attr(),

  //--- relations
  accountAcceptanceStatus: belongsTo('toezicht-account-acceptance-status', { inverse: null }),
  authenticityType: belongsTo('toezicht-document-authenticity-type', { inverse: null }),
  besluitType: belongsTo('besluit-type', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null }),
  bestuursorgaan: belongsTo('bestuursorgaan', { inverse: null }),
  deliveryReportType: belongsTo('toezicht-delivery-report-type', { inverse: null }),
  fileAddresses: hasMany('file-address', { inverse: null }),
  files: hasMany('file', { inverse: null }),
  fiscalPeriod: belongsTo('toezicht-fiscal-period', { inverse: null }),
  formSolution: belongsTo('form-solution', { inverse: null }),
  inzendingType: belongsTo('toezicht-inzending-type', { inverse: null }),
  lastModifier: belongsTo('gebruiker', { inverse: null }),
  melding: belongsTo('inzending-voor-toezicht-melding', { inverse: null }),
  nomenclature: belongsTo('toezicht-nomenclature', { inverse: null }),
  regulationType: belongsTo('toezicht-regulation-type', { inverse: null }),
  status: belongsTo('document-status', { inverse: null }),
  taxRates: hasMany('tax-rate', { inverse: null }),
  simplifiedTaxRates: hasMany('simplified-tax-rate', { inverse: null }),
  taxType: belongsTo('toezicht-tax-type', { inverse: null })
});
