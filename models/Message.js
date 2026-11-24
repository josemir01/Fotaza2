
import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Message extends Model {}

Message.init(
    {
        messageid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        texto: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        idConversation: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idSender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Message',
        tableName: 'message',
        timestamps: true,
    }
);
