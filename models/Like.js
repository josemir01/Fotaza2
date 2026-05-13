import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Like extends Model {}

Like.init(
    {
        likeid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
            unique:true,
        },
    },
    {
        sequelize, 
        modelName: 'Like',
        schema: 'like',
        createdAt: true,
        deletedAt: true,
    },
);


