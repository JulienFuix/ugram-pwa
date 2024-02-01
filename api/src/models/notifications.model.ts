// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/hooks";

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const notifications = sequelizeClient.define(
    "notifications",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM("COMMENT", "LIKE", "FOLLOW", "MESSAGE"),
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      viewed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      conversation_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: false,
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
  (notifications as any).associate = function (models: any): void {
    // Define associations here
    notifications.belongsTo(models.users, { foreignKey: "receiver_id" });
    notifications.belongsTo(models.users, { foreignKey: "associate_user_id" });
    notifications.belongsTo(models.publications, {
      foreignKey: { name: "publication_id", allowNull: true },
    });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return notifications;
}
