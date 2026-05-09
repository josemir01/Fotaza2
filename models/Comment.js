import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class Comment extends Model {}

Comment.init(
    {
        Commentid:{
            type: DataTypes.INTEGER,
            AutoIncrement: true,
            primarykey:true,
        },
        postid:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content:{
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
        modelName: 'Content',
        schema: 'content',
        createdAt: true,
        deletedAt: true,
    },
);