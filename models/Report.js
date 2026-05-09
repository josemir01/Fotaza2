import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class Report extends Model {}

Report.init(
    {
        reportid:{
            type: DataTypes.INTEGER,
            AutoIncrement: true,
            primarykey:true,
        },
        userid:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        postid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        motive:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        state:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull:false,
        }
    },
    {
        
        sequelize, 
        modelName: 'Report',
        schema: 'report',
        createdAt: true,
        deletedAt: true,
    },
);