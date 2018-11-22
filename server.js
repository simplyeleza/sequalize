//create an instance of express and Sequelize
const express= require('express');
const Sequelize=require('sequelize');

const app = express();
const port=8001;
const _USERS =require('./users.json');



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

//creating the model
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


});

app.post('/post',(req,res)=>{
    
    const newUser =req.body.user;
    
    User.create({
      name:newUser.name,
      email:newUser.email
    })
      .then(user =>{
          res.json(user);
      })
      .catch(error =>{
          console.log(error);
          res.status(404).send(error);
      })
})



//syncing and authenticate sequel
connection
.sync({
   // logging:console.log,

    //force will drop a user table then recreate it
    //force:true
})
//enter data into database using create method
.then(()=>{
    User.bulkCreate(_USERS)
    .then(users => {
       console.log("Success adding users");
    })
    .catch(error => {
        console.log(error);
    })
})
.then(() => {
console.log('Connection to database established successfully');
})
.catch(err =>{
console.error('Unable to connect to the database:',err);
});

app.listen(port,()=>{
console.log('Running server on port ' + port);
});

