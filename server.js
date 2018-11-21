//create an instance of express and Sequelize
const express= require('express');
const Sequelize=require('sequelize');

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

//creating the model
const User = connection.define('User',{
    uuid:{
      type:Sequelize.UUID,
      primaryKey:true,
      defaultValue:Sequelize.UUIDV4,
      allowNull:false
    },
    first:Sequelize.STRING,
    last:Sequelize.STRING,
    full_name:Sequelize.STRING,  
    bio: Sequelize.TEXT     
   },{
 //when declaring options for freeze we have to declare them as third parameters as property on an object
        hooks:{
          beforeValidate:()=>{
               console.log('before validate');
          },
          afterValidate:()=>{
            console.log('after validate'); 
          },
          beforeCreate: (user) =>{
             user.full_name ='${user.first} ${user.last}';
             console.log('before create');
          },
          afterCreate:() => {
            console.log('after create');
          } 
        }

});

app.get('/',(req,res)=>{
    User.create({
        name:'Jo',
        bio:'kENYAN BOY'  
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
    logging:console.log,

    //force will drop a user table then recreate it
    force:true
})
//enter data into database using create method
.then(()=>{
    User.create({
        first:'Joe',
        last:'Smith',
        bio:'New Bio here'      
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

