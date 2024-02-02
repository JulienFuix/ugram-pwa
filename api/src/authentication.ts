import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth, OAuthProfile, OAuthStrategy } from '@feathersjs/authentication-oauth';
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from './declarations';

const front_url = "https://api.ugram.online/"; //prod
// const front_url = "http://localhost:3000/"; //dev

declare module './declarations' {
	interface ServiceTypes {
		'authentication': AuthenticationService & ServiceAddons<any>;
	}
}

class GoogleStrategy extends OAuthStrategy {
	async getEntityData(profile: OAuthProfile) {

		// this will set 'googleId'
		const baseData = await super.getEntityData(profile, undefined, {});

		// this will grab the picture and email address of the Google profile
		return {
			...baseData,
			email: profile.email,
			username: profile.name,
			name: profile.given_name + " " + profile.family_name
		};
	}

	// async getRedirect(data: AuthenticationResult | Error | any, params?: Params): Promise<string | null> {
	// 	const accessToken = data.accessToken ? data.accessToken : data.message || 'OAuth Authentication not successful';
	// 	return `${front_url}/oauth?#access_token=${accessToken}`;
	// }
}

export default function (app: Application): void {
	const authentication = new AuthenticationService(app);

	authentication.register('jwt', new JWTStrategy());
	authentication.register('local', new LocalStrategy());
	authentication.register('google', new GoogleStrategy());

	app.use('/authentication', authentication);
	app.configure(expressOauth());
}
