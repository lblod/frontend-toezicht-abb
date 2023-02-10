/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ToezichtRoute extends Route.extend(
  AuthenticatedRouteMixin
) {}
