import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Image extends Model {}

Image.init(
    {
        imageid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
            unique:true,
            allowNull:false,
        },
        image:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        comentDisable:{
            type:DataTypes.BOOLEAN,
            allowNull: true,
        },
        copyright:{
            type:DataTypes.BOOLEAN,
            allowNull: false,
        },
        idPost: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    },
    {
        sequelize, 
        modelName: 'Image',
        tableName: 'image',
        createdAt: true,
        deletedAt: true,
    },
);

