// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/hooks";

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const publicationsHashtags = sequelizeClient.define(
    "publications_hashtags",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      publication_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
      },
      hashtag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
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
  (publicationsHashtags as any).associate = function (models: any): void {
    // Define associations here
    // publicationsHashtags.belongsTo(models.publications, {
    //   foreignKey: "publication_id",
    // });
    // publicationsHashtags.belongsTo(models.hashtags, {
    //   foreignKey: "hashtag_id",
    // });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return publicationsHashtags;
}
