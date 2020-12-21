import Application from 'frontend-toezicht-abb/app';
import config from 'frontend-toezicht-abb/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
