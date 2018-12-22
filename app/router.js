import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('toezicht', function() {
    this.route('inzendingen', function() {
      this.route('show', { path: '/:id' });
    });
  });
  this.route('route-not-found', {
    path: '/*wildcard'
  });
});

export default Router;
