// Initializes the `Likes` service on path `/likes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Likes } from './likes.class';
import createModel from '../../models/likes.model';
import hooks from './likes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'likes': Likes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/likes', new Likes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('likes');

  service.hooks(hooks);
}
