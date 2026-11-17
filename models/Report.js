import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Report extends Model { }

Report.init(
    {
        reportid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idComment: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idImage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {

        sequelize,
        modelName: 'Report',
        tableName: 'report',
        createdAt: true,
        paranoid: true,
    },
);

