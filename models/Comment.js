import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Comment extends Model {}

Comment.init(
    {
        Commentid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        content:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        
        sequelize, 
        modelName: 'Comment',
        schema: 'comment',
        createdAt: true,
        deletedAt: true,
    },
);

