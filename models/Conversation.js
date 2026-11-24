import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Conversation extends Model { }


//id de usuario comprador
//id del autor
//id de la imagen conexion con imagen que te interesa

Conversation.init(
    {
        conversationid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        idBuyer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idAuthor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idImage: {
            type: DataTypes.INTEGER,
            allowNull: false,
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