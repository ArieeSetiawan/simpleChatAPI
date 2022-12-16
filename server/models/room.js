'use strict';
const uuid = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userOne',
        as:'firstUser'
      })
      this.belongsTo(models.User, {
        foreignKey: 'userTwo',
        as:'secondUser'
      })
      this.hasMany(models.chat, {
        foreignKey: 'roomId',
        as:'chat'
      })
    }
  }
  room.init({
    userOne: DataTypes.UUID,
    userTwo: DataTypes.UUID,
    unreadCountUserOne: DataTypes.INTEGER,
    unreadCountUserTwo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'room',
  });
  room.addHook('beforeCreate', (user, options) => {
    try {
      user.id = uuid.v4();
    } catch (err) {
      throw err;
    }
  });
  return room;
};