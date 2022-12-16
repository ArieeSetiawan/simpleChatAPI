const { User } = require('../models');
const { userContact } = require('../models')
const { Op }=require('sequelize')
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
require('dotenv').config()

class userController {
    static async register (req,res){
    try{
      const cekAvailability = await User.findOne({
        where:{
          [Op.or]:[{phone: req.body.phone},{email: req.body.email}]                        
        }
      })
      if (cekAvailability != null){
        return res.status(400).json({
          msg: 'Email or Phone has been Taken'
        })
      }

     const hashedpassword = await bcrypt.hash(req.body.password, 12)
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword,
            phone: req.body.phone
        }
    await User.create(newUser);

    return res.status(201).json({
        message: 'Successfully add User',
        user_email: newUser.email
      })
      
    }
    catch(err){
        return res
        .status(err.status ||  500)
        .json({ message: err.message || 'Internal server error' })
}
    }

    static async login(req,res){
    try{
        const userLogin = {
            email: req.body.email,
            password: req.body.password,
        }
        let u = await User.findOne({where:{email:userLogin.email}});
        if (u){
            const match = await bcrypt.compareSync(userLogin.password, u.password);
            if(match){
              const token = jwt.sign({
                id: u.id,
                name: u.name,
                email: u.email,
              }, process.env.SECRET_KEY,
              // {expiresIn: '1h'}
              );
              
                return res.status(200).json({msg:'Successfully Login',token});
            }else{
                return res.status(401).json('Wrong Password');
            }
        }else{
            return res.status(401).json('User Not Found');
        }
    }

      catch (err) {
        return res
          .status(err.status || 500)
          .json({
            message: err.message || 'Internal server error.',
          })
      }
    }

    static async getAllUser(req, res) {
        const rows = await User.findAll({
            attributes:{exclude:['password']}
        });
    
        return res.status(200).json({
          message: 'Successfully get all User',
          data: rows
        })
    }

    static async getUserbyID(req, res) {
        try {
        const userID = req.params.id
        const rows = await User.findAll({
            where:{
              id: userID,
              },
              attributes:{exclude:['password']}
          }
        );  
        if (rows == 0){
            return res.status(404).json({
              message: "User not Found"
            })
          }
          else{
            return res.status(200).json({
              message: 'Succesfully get User Information',
              data: rows
            })}

        } catch (err) {
          return res
            .status(err.status ||  500)
            .json({ message: err.message || 'Internal server error' })
    }}

    static async editUserbyID(req, res) {
   try{
        await User.update({
            name: req.body.name
          },{
            where:{
              id:req.params.id
            }
          });
          return res.status(200).json({
              message: "Successfully change username."
          })
      } catch (err) {
          return res
            .status(err.status || 500)
            .json({
              message: err.message || 'Internal server error.',
            })
        }   
    }

    static async deleteUser(req, res) {
        try {
          if (!req.params.id) return { status: 400, message: 'ID cannot be empty' }
    
          await User.destroy({
            where: { id: req.params.id }
          });
    
          return res.status(200).json({
            message: 'Successfully delete User'
          })
        } catch (err) {
          return res
            .status(err.status ||  500)
            .json({ message: err.message || 'Internal server error' })
    }
    }

    static async getAllContact(req,res){
      try{
        const rows = await userContact.findAll({
          where:{
            sourceUserId: req.user.id,
          },
          include:[{
            model: User,
            as:'user',
            attributes:{exclude:['password']}
          }]
      });
      return res.status(200).json({
        message: 'Successfully get all User',
        data: rows
      })

      }catch(err){
        return res
        .status(err.status ||  500)
        .json({ message: err.message || 'Internal server error' })
  }

    }

    static async addFriend(req,res){
      try{
        const cekAvailability = await userContact.findOne({
          where :{
            sourceUserId: req.user.id,
            destinationUserId: req.body.destinationId
          }
        })
        if (cekAvailability != null){
          return res.status(400).json({
            msg: 'This user is already your friend'
          })
        }
        
        const addFriend = {
          sourceUserId: req.user.id,
          destinationUserId: req.body.destinationId
        }
        await userContact.create(addFriend);
  
        return res.status(201).json({
          message: 'Successfully add friend',
          data: addFriend
        })
      }
      catch(err){
          return res
          .status(err.status ||  500)
          .json({ message: err.message || 'Internal server error' })
    }
}
}
    




module.exports = userController;