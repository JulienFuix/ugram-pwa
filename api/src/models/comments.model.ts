// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { HookReturn } from "sequelize/types/hooks";
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
	const sequelizeClient: Sequelize = app.get('sequelizeClient');
	const comments = sequelizeClient.define('comments', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		hooks: {
			beforeCount(options: any): HookReturn {
				options.raw = true;
			}
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(comments as any).associate = function (models: any): void {
		// Define associations here
		comments.belongsTo(models.users, {
			foreignKey: "user_id",
			foreignKeyConstraint: true,
		});
		comments.belongsTo(models.publications, {
			foreignKey: "publication_id",
			foreignKeyConstraint: true,
		});
		// See https://sequelize.org/master/manual/assocs.html
	};

	return comments;
}
