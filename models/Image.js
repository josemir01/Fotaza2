import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class image extends Model {}

image.init(
    {
        imageid:{
            type: DataTypes.INTEGER,
            AutoIncrement: true,
            primarykey:true,
        },
        postid:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image:{
            type: DataTypes.BLOB,
            allowNull: false,
        },
    },
    {
        sequelize, 
        modelName: 'Image',
        schema: 'image',
        createdAt: true,
        deletedAt: true,
    },
);