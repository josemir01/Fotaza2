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
        description:{
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        
        sequelize, 
        modelName: 'Post',
        schema: 'post',
        createdAt: true,
        deletedAt: true,
    },
);
