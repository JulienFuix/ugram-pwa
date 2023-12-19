// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { HookReturn } from "sequelize/types/hooks";
import { Application } from "../declarations";

export default function (app: Application): typeof Model {
	const sequelizeClient: Sequelize = app.get("sequelizeClient");
	const users = sequelizeClient.define(
		"users",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: false,
			},
			googleId: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: false,
			},
			mode: {
				type: DataTypes.ENUM("local", "oauth"),
				allowNull: false,
				unique: false,
			}
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
	(users as any).associate = function (models: any): void {
		// Define associations here
		users.hasMany(models.publications, {
			foreignKey: "user_id",
			onDelete: "CASCADE"
		});
		users.hasMany(models.comments, {
			foreignKey: "user_id",
			onDelete: "CASCADE"
		});
		users.hasMany(models.likes, {
			foreignKey: "user_id",
			onDelete: "CASCADE"
		});
		users.belongsTo(models.files, {
			foreignKey: "image_id",
			as: "image",
			onDelete: "CASCADE"
		});
		users.hasMany(models.user_following, { foreignKey: "user_id", as: "follower" });
		users.hasMany(models.user_following, { foreignKey: "followed_id", as: "followed" });
        users.hasMany(models.conversations, {
			foreignKey: "receiver_id",
			onDelete: "CASCADE",
            as: "receiver"
		});
        users.hasMany(models.conversations, {
			foreignKey: "creator_id",
			onDelete: "CASCADE",
			as: "creator",
		});
		// See https://sequelize.org/master/manual/assocs.html
	};

	return users;
}
