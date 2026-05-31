import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Message extends Model {}

Message.init(
    {
        texto:{
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize, 
        modelName: 'Message',
        tableName: 'message',
        createdAt: true,
        deletedAt: true,
    },
);