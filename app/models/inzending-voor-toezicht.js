import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

@classic
export default class InzendingVoorToezicht extends Model {
  //--- attributes
  @attr()
  agendaItemCount;

  @attr()
  businessIdentifier;

  @attr()
  businessName;

  @attr('datetime')
  created;

  @attr('date')
  dateHandover;

  @attr('date')
  dateOfEntryIntoForce;

  @attr('date')
  datePublicationWebapp;

  @attr('date')
  decisionDateOtherAdministration;

  @attr()
  decisionSummary;

  @attr()
  description;

  @attr('date')
  endDate;

  @attr()
  hasExtraTaxRates;

  @attr('datetime')
  modified;

  @attr()
  remark;

  @attr('datetime')
  sentDate;

  @attr('datetime')
  sessionDate;

  @attr()
  temporalCoverage;

  @attr()
  text;

  //--- relations
  @belongsTo('toezicht-account-acceptance-status', { inverse: null })
  accountAcceptanceStatus;

  @belongsTo('toezicht-document-authenticity-type', { inverse: null })
  authenticityType;

  @belongsTo('besluit-type', { inverse: null })
  besluitType;

  @belongsTo('bestuurseenheid', { inverse: null })
  bestuurseenheid;

  @belongsTo('bestuursorgaan', { inverse: null })
  bestuursorgaan;

  @belongsTo('toezicht-delivery-report-type', { inverse: null })
  deliveryReportType;

  @hasMany('file-address', { inverse: null })
  fileAddresses;

  @hasMany('file', { inverse: null })
  files;

  @belongsTo('toezicht-fiscal-period', { inverse: null })
  fiscalPeriod;

  @belongsTo('form-solution', { inverse: null })
  formSolution;

  @belongsTo('toezicht-inzending-type', { inverse: null })
  inzendingType;

  @belongsTo('gebruiker', { inverse: null })
  lastModifier;

  @belongsTo('inzending-voor-toezicht-melding', { inverse: null })
  melding;

  @belongsTo('toezicht-nomenclature', { inverse: null })
  nomenclature;

  @belongsTo('toezicht-regulation-type', { inverse: null })
  regulationType;

  @belongsTo('document-status', { inverse: null })
  status;

  @hasMany('tax-rate', { inverse: null })
  taxRates;

  @hasMany('simplified-tax-rate', { inverse: null })
  simplifiedTaxRates;

  @belongsTo('toezicht-tax-type', { inverse: null })
  taxType;
}
