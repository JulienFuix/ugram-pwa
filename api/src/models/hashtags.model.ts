// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/hooks";

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const hashtags = sequelizeClient.define(
    "hashtags",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      text: {
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
  (hashtags as any).associate = function (models: any): void {
    // Define associations here
    hashtags.belongsToMany(models.publications, {
      through: { model: "publications_hashtags", unique: false },
      foreignKey: "hashtag_id",
      otherKey: "publication_id",
    });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return hashtags;
}
