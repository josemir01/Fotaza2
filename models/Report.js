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
    },
    {
        
        sequelize, 
        modelName: 'Report',
        schema: 'report',
        createdAt: true,
        deletedAt: true,
    },
);

