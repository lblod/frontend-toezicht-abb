import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('login');

  this.route('toezicht', function() { // keep supporting old inzending URLs
    this.route('inzendingen', function() {
      this.route('show', { path: '/:id' });
    });
  });

  this.route('supervision', function() {
    this.route('submissions', function() {
      this.route('show', { path: '/:id' });
    });
  });
  this.route('search', function() {
    this.route('submissions', function() {
      this.route('show', { path: '/:id' });
    });
  });
  this.route('legaal', function() {
    this.route('cookieverklaring');
    this.route('disclaimer');
  });
  this.route('contact');
  this.route('route-not-found', {
    path: '/*wildcard'
  });

  this.route('mock-login');

  this.route('user', function() {
    this.route('search-queries', function() {
      this.route('new');
    });
  });
});
