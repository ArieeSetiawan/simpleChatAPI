'use strict';
const uuid = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.userContact, {
        foreignKey: 'destinationUserId',
        as:'user'
      })
      this.hasMany(models.room, {
        foreignKey: 'userOne',
      })
      this.hasMany(models.room, {
        foreignKey: 'userTwo',
      })
      // this.hasMany(models.usercontact, {
      //   foreignKey: 'destinationUserId',
      //   as:'destinationId'
      // })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', (user, options) => {
    try {
      user.id = uuid.v4();
    } catch (err) {
      throw err;
    }
  });
  return User;
};