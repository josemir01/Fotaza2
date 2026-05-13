import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Hashtag extends Model {}

Hashtag.init(
    {
        hashtagid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: true,
            unique:true,
        },
    },
    {
        sequelize, 
        modelName: 'Hashtag',
        schema: 'hashtag',
        createdAt: true,
        deletedAt: true,
    },
);

