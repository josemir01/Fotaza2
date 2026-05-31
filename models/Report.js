import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Report extends Model {}

Report.init(
    {
        reportid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        motive:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        state:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idPost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idComment: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        
        sequelize, 
        modelName: 'Report',
        tableName: 'report',
        createdAt: true,
        deletedAt: true,
    },
);

