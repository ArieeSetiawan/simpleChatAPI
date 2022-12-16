'use strict';
const uuid = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userContact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'destinationUserId',
        as:'user'
      })
    }
  }
  userContact.init({
    sourceUserId: DataTypes.UUID,
    destinationUserId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'userContact',
  });

  userContact.addHook('beforeCreate', (user, options) => {
    try {
      user.id = uuid.v4();
    } catch (err) {
      throw err;
    }
  });

  return userContact;
};