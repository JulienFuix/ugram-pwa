// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { HookReturn } from "sequelize/types/hooks";
import { Application } from "../declarations";

export default function (app: Application): typeof Model {
	const sequelizeClient: Sequelize = app.get("sequelizeClient");
	const publications = sequelizeClient.define(
		"publications",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
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
	(publications as any).associate = function (models: any): void {
		// Define associations here
		publications.belongsTo(models.users, {
			foreignKey: "user_id",
			foreignKeyConstraint: true,
		});
		publications.hasMany(models.comments, {
			foreignKey: "publication_id",
			foreignKeyConstraint: true,
			onDelete: "CASCADE"
		});
		publications.belongsTo(models.files, {
			as: "image",
			foreignKey: "image_id",
		});
		publications.hasMany(models.likes, {
			foreignKey: "user_id",
		});
		publications.belongsToMany(models.hashtags, {
			through: { model: "publications_hashtags", unique: false },
			foreignKey: "publication_id",
			otherKey: "hashtag_id",
		});
		// See https://sequelize.org/master/manual/assocs.html
	};

	return publications;
}
