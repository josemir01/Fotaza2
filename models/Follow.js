import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class Follow extends Model {}

Follow.init(
    {
        followerid:{
            type: DataTypes.INTEGER,
            allowNull:false,
            unique:true,
        },
        followeid:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique:true,
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull:false,
        }
    },
    {
        sequelize, 
        modelName: 'Follow',
        schema: 'follow',
        createdAt: true,
        deletedAt: true,
    },
);