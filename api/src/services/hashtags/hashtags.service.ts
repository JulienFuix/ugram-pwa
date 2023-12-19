// Initializes the `hashtags` service on path `/hashtags`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Hashtags } from './hashtags.class';
import createModel from '../../models/hashtags.model';
import hooks from './hashtags.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'hashtags': Hashtags & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/hashtags', new Hashtags(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('hashtags');

  service.hooks(hooks);
}
