import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Collection extends Model {}

Collection.init(
{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },

    description:{
        type:DataTypes.TEXT,
    },

    isPrivate:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    }
},
{
    sequelize,
    modelName:'Collection',
    tableName:'collections',
    timestamps:true,
}
)