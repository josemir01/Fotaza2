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
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idPost: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
    },
    {
        sequelize, 
        modelName: 'Like',
        tableName: 'like',
        createdAt: true,
        deletedAt: true,
    },
);


