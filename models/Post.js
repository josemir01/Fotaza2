import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class Post extends Model {}

Post.init(
    {
        postid:{
            type: DataTypes.INTEGER,
            AutoIncrement: true,
            primarykey:true,
        },
        userid:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        contentURL: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true,
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