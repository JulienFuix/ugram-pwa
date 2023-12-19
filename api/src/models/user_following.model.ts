// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { HookReturn } from "sequelize/types/hooks";
import { Application } from "../declarations";

export default function (app: Application): typeof Model {
	const sequelizeClient: Sequelize = app.get("sequelizeClient");
	const userFollowing = sequelizeClient.define(
		"user_following",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			hooks: {
				beforeCount(options: any): HookReturn {
					options.raw = true;
				},
			},
		}
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(userFollowing as any).associate = function (models: any): void {
		// Define associations here
		userFollowing.belongsTo(models.users, {
			as: "follower",
			foreignKey: "user_id",
			foreignKeyConstraint: true,
		});
		userFollowing.belongsTo(models.users, {
			as: "followed",
			foreignKey: "followed_id",
			foreignKeyConstraint: true,
		});

		// See https://sequelize.org/master/manual/assocs.html
	};

	return userFollowing;
}
