import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Conversation extends Model {}


//id de usuario comprador
//id del autor
//id de la imagen conexion con imagen que te interesa

Conversation.init(
    {
        conversationid:{
            type: DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
        },
    },
    {
        sequelize, 
        modelName: 'Conversation',
        tableName: 'conversation',
        createdAt: true,
        deletedAt: true,
    },
);