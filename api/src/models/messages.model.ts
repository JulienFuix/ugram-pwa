// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/hooks";

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const messages = sequelizeClient.define(
    "messages",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      send_at: {
        type: DataTypes.DATE,
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
  (messages as any).associate = function (models: any): void {
    // Define associations here
    messages.belongsTo(models.conversations, { foreignKey: "conversation_id" });
    messages.belongsTo(models.users, { foreignKey: "sender_id" });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return messages;
}
