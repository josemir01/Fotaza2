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
        value:{
            type: DataTypes.DOUBLE,
            allowNull:false,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idPost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        
        sequelize, 
        modelName: 'Rating',
        tableName: 'rating',
        timestamps: true,
        paranoid: true
    },
);
