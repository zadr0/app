import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";
export const admin = new Sequelize(process.env.sql_DB, process.env.sql_user, process.env.sql_password, {
    dialect: "mysql",
    host: process.env.sql_host,
    logging: false,
    define: {
        timestamps: false
    }
});
export var models;
(function(models) {
    models.EconomyModel = admin.define('Economy', {
        userId: {
            type: DataTypes.STRING(255),
            unique: true,
            primaryKey: true
        },
        value: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        }
    });
    models.ModModel = admin.define('Moderation', {
        EventId: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING(255)
        },
        expired: {
            type: DataTypes.DATE
        },
        reason: {
            type: DataTypes.STRING(255)
        },
        chatId: {
            type: DataTypes.STRING(255)
        },
        punish: {
            type: DataTypes.STRING(255)
        },
        moderator: {
            type: DataTypes.STRING(255)
        }
    });
})(models || (models = {}));
await (async ()=>{
    await admin.sync({
        alter: true
    });
})();
