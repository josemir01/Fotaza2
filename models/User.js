import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class User extends Model {}

User.init(
    {
        userid:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        password:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        birthDate:{
            type: DataTypes.DATEONLY
        },
        avatar:{
            type: DataTypes.BLOB,
            allowNull:true,
        },
    },
    {
        sequelize, 
        modelName: 'User',
        tableName: 'users',
        createdAt: true,
        deletedAt: true,
    },
);

