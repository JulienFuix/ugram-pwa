// Initializes the `getFamousUser` service on path `/get-famous-user`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { GetFamousUser } from './get-famous-user.class';
import hooks from './get-famous-user.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'get-famous-user': GetFamousUser & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/get-famous-user', new GetFamousUser(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-famous-user');

  service.hooks(hooks);
}
