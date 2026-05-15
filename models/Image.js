import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class image extends Model {}

image.init(
    {
        imageid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        image:{
            type: DataTypes.BLOB,
            allowNull: false,
        },
        comentDisable:{
            type:DataTypes.BOOLEAN,
            allowNull: true,
        }
    },
    {
        sequelize, 
        modelName: 'Image',
        schema: 'image',
        createdAt: true,
        deletedAt: true,
    },
);

