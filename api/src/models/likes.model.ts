// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from "sequelize/types/hooks";
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
	const sequelizeClient: Sequelize = app.get('sequelizeClient');
	const likes = sequelizeClient.define('likes', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		}
	}, {
		hooks: {
			beforeCount(options: any): HookReturn {
				options.raw = true;
			}
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(likes as any).associate = function (models: any): void {
		// Define associations here
		likes.belongsTo(models.users, {
			as: "lover",
			foreignKey: "user_id",
			foreignKeyConstraint: true,
		});
		likes.belongsTo(models.publications, {
			as: "loved",
			foreignKey: "publication_id",
			foreignKeyConstraint: true,
		});
		// See https://sequelize.org/master/manual/assocs.html
	};

	return likes;
}
