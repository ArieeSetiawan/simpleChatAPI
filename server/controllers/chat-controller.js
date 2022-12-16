const { User } = require('../models');
const { chat } = require('../models');
const { room } = require('../models')
const { Op }=require('sequelize')
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.appId,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true
  });


class chatController {
    static async getAllRoom(req,res){
        try{
            const rooms = await room.findAll({
                where:{
                    [Op.or]:[{userOne:req.user.id},{userTwo:req.user.id}]         
                    },
                include:[{
                        model: User,
                        as:'firstUser',
                        attributes:{exclude:['id','password','email','phone','createdAt','updatedAt']}
                      },
                      {
                        model: User,
                        as:'secondUser',
                        attributes:{exclude:['id','password','email','phone','createdAt','updatedAt']}
                      },
                    ]
            });
            let arrData= []
            for(const data of rooms){
                if(req.user.id==data.userOne){
                    const message = await chat.findOne({
                        where:{roomId:data.id},
                        order: [ [ 'createdAt', 'DESC' ]],
                    })
                    arrData.push({
                        roomId: data.id,
                        name: data.secondUser.name,
                        unreadCount: data.unreadCountUserOne, 
                        lastMessage: message.message})                    
                }else{
                        const message = await chat.findOne({
                        where:{roomId:data.id},
                        order: [ [ 'createdAt', 'DESC' ]],
                    })
                    arrData.push({
                        roomId: data.id,
                        name: data.firstUser.name, 
                        unreadCount: data.unreadCountUserTwo, 
                        lastMessage: message.message})         
                }
                }

            return res.status(200).json({
              message: 'Successfully get all User',
              data: arrData
            }) 
        }catch(err){
            return res
            .status(err.status ||  500)
            .json({ message: err.message || 'Internal server error' })            
        }

    }
    static async sendChat(req,res){
        try{
            let message = req.body.message
            if(message==""){
                return res.status(403).json({
                    data:"Message cannot be empty"
                })
            }else{
                let roomId = await room.findOne({
                        where:{
                            [Op.or]:[
                                {userOne:req.user.id, userTwo:req.body.userDestinationId},
                                {userOne:req.body.userDestinationId, userTwo:req.user.id}
                            ]         
                            },
                       })
                      if (roomId == null){
                          const newRoom ={
                              userOne:req.user.id,
                              userTwo:req.body.userDestinationId,
                              unreadCountUserOne: 0,
                              unreadCountUserTwo: 0,
                            }
                        roomId = await room.create(newRoom)
                        }
                        
                    if(req.user.id===roomId.userOne){
                        await room.increment('unreadCountUserTwo',
                            {by:1 ,                      
                                 where:{
                                    id:roomId.id
                                        }
                            })
                    }else{
                    await room.increment('unreadCountUserOne',
                            {by:1 ,                      
                                where:{
                                    id:roomId.id
                                        }
                            }
                        )}
            
                    const newChat = {
                        roomId: roomId.id,
                        source: req.user.id,
                        message: req.body.message
                    }
                    await chat.create(newChat)

                    pusher.trigger(`${roomId.id}`, "my-event", {
                        username: req.user.id,
                        message: req.body.message
                      });
        
                    return res.status(200).json({
                        message: 'Successfully create Chat',
                      }) 

            }
            }
        catch(err){
            return res
            .status(err.status ||  500)
            .json({ message: err.message || 'Internal server error' })
    }
        }
    static async getRoomDetail(req,res){
        try{
            const rows = await room.findOne({
                where:{
                    id: req.params.id,
                    [Op.or]:[
                        {userOne:req.user.id},{userTwo:req.user.id}
                    ]    
                },
                attributes:{exclude:['unreadCountUserOne','unreadCountUserTwo']},
                include:[{
                    model: chat,
                    as:'chat',
                    order: [ [ 'createdAt', 'DESC' ]]
                  }]
              }
            )
           if(req.user.id==rows.userOne){
            await room.update({unreadCountUserOne:0},
                {where:{
                    id:rows.id
                }})                
            }else{
            await room.update({unreadCountUserTwo:0},
                {where:{
                    id:rows.id
            }})   
            }

            return res.status(200).json({
                message: 'Succesfully get User Information',
                data: rows
              });  
        }catch(err){
            return res
            .status(err.status ||  500)
            .json({ message: err.message || 'Internal server error' })
    }
    }
}

module.exports=chatController