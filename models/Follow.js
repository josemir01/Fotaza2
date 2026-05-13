import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Follow extends Model {}

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
    },
    {
        sequelize, 
        modelName: 'Follow',
        schema: 'follow',
        createdAt: true,
        deletedAt: true,
    },
);

