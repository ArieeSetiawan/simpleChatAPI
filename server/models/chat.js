'use strict';
const uuid = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.room, {
        foreignKey: 'roomId',
        as:'chat'
      })
    }
  }
  chat.init({
    roomId: DataTypes.UUID,
    source: DataTypes.UUID,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chat',
  });
  chat.addHook('beforeCreate', (user, options) => {
    try {
      user.id = uuid.v4();
    } catch (err) {
      throw err;
    }
  });
  return chat;
};