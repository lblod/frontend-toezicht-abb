import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('login');
  this.route('toezicht', function() {
    this.route('inzendingen', function() {
      this.route('show', { path: '/:id' });
    });
    this.route('vlabel-inzendingen', function() {
      this.route('show', { path: '/:id' });
    });
  });

  this.route('supervision', function() {
    this.route('submissions');
  });

  this.route('legaal', function() {
    this.route('cookieverklaring');
    this.route('disclaimer');
  });
  this.route('contact');
  this.route('search-toezicht', function() {
    this.route('show', { path: '/:id' });
  });
  this.route('route-not-found', {
    path: '/*wildcard'
  });

  this.route('mock-login');
});
