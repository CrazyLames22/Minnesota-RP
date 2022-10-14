const { DataTypes, Model } = require("sequelize");

module.exports = class error extends Model {
    static init (sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            type: DataTypes.STRING,
            reason: DataTypes.STRING,
            notes: DataTypes.STRING,
            date: DataTypes.DATE,
            suspect: DataTypes.JSON,
            moderator: DataTypes.JSON,
        }, {
            tableName: 'infractions',
            timestamps: true, 
            sequelize
        });
    };
};