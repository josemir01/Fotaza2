import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Rating extends Model {}

Rating.init(
    {
        ratingid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        value:{
            type: DataTypes.INTEGER,
            allowNull:false,
        }
    },
    {
        
        sequelize, 
        modelName: 'Rating',
        schema: 'rating',
        createdAt: true,
        deletedAt: true,
    },
);
