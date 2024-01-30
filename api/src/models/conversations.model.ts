// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/hooks";

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const conversations = sequelizeClient.define(
    "conversations",
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
  (conversations as any).associate = function (models: any): void {
    // Define associations here
    conversations.belongsTo(models.users, { foreignKey: "creator_id", as: "creator" });
    conversations.belongsTo(models.users, { foreignKey: "receiver_id", as: "receiver" });
    conversations.hasMany(models.messages, { foreignKey: "conversation_id", as: "lastMessage" });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return conversations;
}
