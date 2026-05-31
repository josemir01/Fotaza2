import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Post extends Model {}

Post.init(
    {
        postid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        
        sequelize, 
        modelName: 'Post',
        tableName: 'post',
        createdAt: true,
        deletedAt: true,
    },
);
