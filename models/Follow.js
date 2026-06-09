import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Follow extends Model {}

Follow.init(
    {
        followerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        followingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize, 
        modelName: 'Follow',
        tableName: 'follow',
        createdAt: true,
        deletedAt: true,
    },
);

