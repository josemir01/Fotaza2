import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class User extends Model { }

User.init(
    {
        userid:{
            type: DataTypes.INTEGER,
            AutoIncrement: true,
            primarykey:true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthDate:{
            type: DataTypes.DATEONLY
        }
    },
    {
        
        sequelize, 
        modelName: 'User',
        schema: 'user',
        createdAt: true,
        deletedAt: true,
    },
);