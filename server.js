//create an instance of express and Sequelize
const express= require('express');
const Sequelize=require('sequelize');
const Op = Sequelize.Op;
const _USERS =require('./users.json');


const app = express();
const port=8001;




//creating a connection with sequelize
const connection = new Sequelize('db','user','pass',{
host:'localhost',
dialect:'sqlite',
storage:'db.sqlite',
operatorsAliases:false,
define:{
    freezeTableName:true
}
});

//creating the user model
const User = connection.define('User',{
name:Sequelize.STRING,
email:{
    type:Sequelize.STRING,
    validate:{
        isEmail:true
    }
},
password: {
    type:Sequelize.STRING,
    validate:{
        isAlphanumeric:true
    }
}


})

//creating the Post model

const Post =connection.define('Post',{
    id:{
        primaryKey:true,
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
    },
    title:Sequelize.STRING,
    content:Sequelize.TEXT
})



app.get('/allposts',(req,res)=>{
   
   Post.findAll({
       include:[User]
   })
   .then(posts =>{
    res.json(posts);
   })
 .catch(error =>{
    console.log(error);
    res.status(404).send(error);
  })


})


Post.belongsTo(User); //puts foreignKey UserId in Post table


//syncing and authenticate sequel
connection
.sync({
   // logging:console.log,

    //force will drop a user table then recreate it
    //force:true
})
.then(()=>{
  Post.create({
   UserId:1,
   title:'First Post',
   content:'post content 1'
  })
})
//enter data into database using create method
/* .then(()=>{
    User.bulkCreate(_USERS)
    .then(users => {
       console.log("Success adding users");
    })
    .catch(error => {
        console.log(error);
    })
}) */
.then(() => {
console.log('Connection to database established successfully');
})
.catch(err =>{
console.error('Unable to connect to the database:',err);
});

app.listen(port,()=>{
console.log('Running server on port ' + port);
});

