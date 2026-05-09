import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class Like extends Model {}

Like.init(
    {
        likeid:{
            type: DataTypes.INTEGER,
            AutoIncrement: true,
            primarykey:true,
            unique:true,
        },
        postid:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userid: {
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
        modelName: 'Like',
        schema: 'like',
        createdAt: true,
        deletedAt: true,
    },
);