import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Follow extends Model {}

Follow.init(
    {
        followerid:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        followeid:{
            type: DataTypes.INTEGER,
            allowNull: false,
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

