import Model, {attr, belongsTo, hasMany} from '@ember-data/model';

export default class Submission extends Model {
  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) created;
  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) modified;
  @attr('datetime') sentDate;
  @attr('datetime') receivedDate;
  @attr source;
  @attr uri;
  @attr href;

  @belongsTo('gebruiker') creator;
  @belongsTo('gebruiker') lastModifier;
  @belongsTo('form-data') formData;
  @belongsTo('bestuurseenheid') organization;
  @belongsTo('vendor') publisher;
  @belongsTo('submission-document') submissionDocument;
  @belongsTo('submission-document-status') status;
  @hasMany('file') files;
  @belongsTo('automatic-submission-task') task;
  @belongsTo('submission-review') review;
  @belongsTo('inzending-voor-toezicht') inzendingVoorToezicht;
}

