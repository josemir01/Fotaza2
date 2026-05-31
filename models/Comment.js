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
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idPost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idImage:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        
        sequelize, 
        modelName: 'Comment',
        tableName: 'comment',
        createdAt: true,
        deletedAt: true,
    },
);

