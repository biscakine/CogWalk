import { Application } from '@nativescript/core';
import '@nativescript/email';
import { TestService } from './services/test.service';
import { EmailService } from './services/email.service';

// Initialize services
TestService.getInstance();
EmailService.getInstance();

// Register modules
require('./views/session/create-session-page');
require('./views/session/sessions-list-page');
require('./views/session/session-detail-page');
require('./views/participant/add-participant-page');
require('./views/test/test-page');
require('./views/test/test-display-page');
require('./views/test/test-input-page');
require('./views/home/home-page');

Application.run({ moduleName: 'app-root' });