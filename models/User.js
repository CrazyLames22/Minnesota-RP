const { DataTypes, Model } = require("sequelize");

module.exports = class error extends Model {
    static init (sequelize) {
        return super.init({
            discordId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            avatar: DataTypes.STRING,
            username: DataTypes.STRING,
            moderator: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            tableName: 'users',
            timestamps: true, 
            sequelize
        });
    };
};