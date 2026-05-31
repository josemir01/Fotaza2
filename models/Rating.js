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
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idPost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        
        sequelize, 
        modelName: 'Rating',
        tableName: 'rating',
        createdAt: true,
        deletedAt: true,
    },
);
