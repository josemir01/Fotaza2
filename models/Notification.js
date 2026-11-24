
import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Notification extends Model { }

Notification.init(
    {
        notificationid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        idReceiver: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idSender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idPost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        idImage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Notification',
        tableName: 'notification',
        timestamps: true,
    }
);
