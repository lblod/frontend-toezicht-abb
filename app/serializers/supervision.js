import JSONAPISerializer from '@ember-data/serializer/json-api';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default class Supervision extends JSONAPISerializer.extend(DataTableSerializerMixin) {}
