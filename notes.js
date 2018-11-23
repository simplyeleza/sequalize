
 //DOCS

 /**

 docs.sequelizejs.com


 **//




 1A//

1//project setup

create server.js which will be entry point to node project

2//create json file
npm init -y


3//install packages will be using

//express is to create server
//install sequelize
//install database 
npm i express sequelize sqlite3 -S 


4//server.js file first contents
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
operatorsAliases:false //this will prevent depreceation warnings
});


//connecting sequalize to our database

connection
.authenticate()
.then(() => {
console.log('Connection to database established successfully');
})
.catch(err =>{
console.log('Connection to database FAILED');
});

//port for listening
app.listen(port,()=>{
console.log('Running server on port ' + port);
});

//run npm
npm start


//CREATING MODELS

//you define a variable


const User = connection.define('User',{

   name:Sequelize.STRING ,
   bio:Sequelize.TEXT

 });


//SYNC MODEL TO DATABASE
   //1 invoke sync() on model
const User = connection.define('User',{

   name:Sequelize.STRING ,
   bio:Sequelize.TEXT

 }).sync();

   //2 invoke syncy on connection
connection.sync({
	logging:console.log
});

//2 invoke syncy on connection .Calling sync performs authentication
connection

.sync({
	logging:console.log
})
.then(() => {
console.log('Connection to database established successfully');
})
.catch(err =>{
console.log('Connection to database FAILED');
});






//test with data
//sequelize users create data
connection

.sync({
	logging:console.log
})

.then(() => {
User.create({
	name:'Joe',
	bio:'New bio entry'
  })
})

.then(() => {
console.log('Connection to database established successfully');
})
.catch(err =>{
console.log('Connection to database FAILED');
});

  

   2A//

//properties to customize our model
//freezeTableName property matches the model name to table name


const connection = new Sequelize('db','user','pass',{
host:'localhost',
dialect:'sqlite',
storage:'db.sqlite',
operatorsAliases:false //this will prevent depreceation warnings

define:{
    freezeTableName:true
}
});


//attribute qualifiers

const User = connection.define('User',{
    uuid:{
      type:Sequelize.UUID,
      primaryKey:true,
      defaultValue:Sequelize.UUIDV4
    }

})



//Attribute validation

 name:{
     type:Sequelize.STRING,
     validate:{
         len:[3]
     } 
    }

bio:{
      type: Sequelize.TEXT,
      validate:{
          contains:{
              args:['foo'],
              msg:'Error:Filed must contain foo'
          }
      }
    }


//creating the model
const User = connection.define('User',{
    uuid:{
      type:Sequelize.UUID,
      primaryKey:true,
      defaultValue:Sequelize.UUIDV4,
      allowNull:false
    },
    name:{
     type:Sequelize.STRING,
     validate:{
         len:[3]
     } 
    },
    first:Sequelize.STRING,
    last:Sequelize.STRING,
    full_name:Sequelize.STRING,  
    bio:{
      type: Sequelize.TEXT,
      validate:{
          contains:{
              args:['foo'],
              msg:'Error:Filed must contain foo'
          }
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


//Hooks
//Called before and after events in sequelize are executed
//we add the property hooks as a third parameter after all of our attributes 
//have been declared

//generatedata.com



2A// ASSOCIATIONS

Used to form a relationship between tables. These relationships are used to create joins.
Joins merges data.

//creating an associate is a two way process
/1.Define association between MODELS
This line of code is added after we define our models.
A userId column will be added to post table 

Post.belongsTo(User)

2 Add include property with value as associated model
Post.findById('1',{
	include:[User]
})

If we want certain attributes , we will wrap the value of our include in object
specificying the model and attributes.


Post.findById('1',{
	include:[{
		model:User
		attributes:['name']  //specify attributes here
	}]
})

    A/PROCESS EXPLAINED

1//creating the post model
 const Post =connection.define('Post',{
    id:{
        primaryKey:true,
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
    },
    title:Sequelize.STRING,
    content:Sequelize.TEXT
})

2//puts foreignKey UserId in Post table
Post.belongsTo(User); 

3.//CREATE A NEW POST
.then(()=>{
  Post.create({
   UserId:1,
   title:'First Post',
   content:'post content 1'
  })
})

4.//Create a new route to view the data

app.get('/allposts',(req,res)=>{

	Post.findAll({
	include:[User]

	})

	.then(posts =>{
		res.json(posts);
	})

	.catch(error =>{
      console.log(error);

 })

5.//Foreign Key

Post.belongsTo(User,{foreignKey:'userId'});


Post.belongsTo(User, {foreignKey: 'userId' }); //puts foreignKey UserId in Post table


B/Model Alias

Model alias renames model when used as an association.

   //One-to-one

   We use belongsTo() or hasOne( )

hasOne( ) places the foreign key to the opposite table
A single item is retrieved 

1.//We add a key value with as 
Post.belongsTo(User, {as:'UserRef', foreignKey: 'userId' }); 

2.//When we include the other model to our query we reference 
//alias using as property

Post.findAll({
include:[{      
model:User , as:'UserRef'
   }]
})


C/One-to-many association

We use hasMany()
An array of Items are retrieved

Ex===User.hasMany(Post)

1//Define association between models

Post.hasMany(Comment,{as:'All_Comments'});


2.Add Include property with value as associated model 

Post.findById('1',{
	include:Comment, as:'All_Comments'
}) 

//creating the Comment model
const Comment = connection.define('Comment',{
    the_comment:Sequelize.STRING    
})

//foreignKey =PostId in comment table
Post.hasMany(Comment,{as:'All_Comments' }); //foreignKey =PostId in comment table


//route

app.get('/singlepost',(req,res)=>{
   
    Post.findById('1',{
        include:[{       
        model:Comment , as:'All_Comments',
        attributes:['the_comment']
     }},{
      model:User , as: 'UserRef'   
         
    })
    .then(posts =>{
     res.json(posts);
    })
  .catch(error =>{
     console.log(error);
     res.status(404).send(error);
   })
 
 
 })


//create two posts and coments

.then(()=>{
    Post.create({
     userId:1,
     title:'Second Post',
     content:'post content 2'
    })
  })
    
.then(()=>{
    Post.create({
     userId:2,
     title:'Third Post',
     content:'post content 3'
    })
  })
   .then(()=>{
    Comment.create({
     PostId:1,
     the_comment:'First comment'
    })
  })
    
.then(()=>{
    Comment.create({
     PostId:1,
     the_comment:'second comment here'
    })
  })



D/ Many-to-many Association

1/.Define association between 2 models using the belongsToMany()

Define this association on both models
It is required to use a through property with a value of new joined 
table will be Called

User.belongsToMany(Project,{as:'Tasks',through:'UserProject'});
Project.belongsToMany(User,{as:'Workers',through:'UserProject'});

This will create a new table called UserProject with two foreign Keys
of userId and ProjectId.

2/Add include property with value as associated model.

When retrieving the user we
User.findById('1',{
	include:Project,as:'Tasks'
})

3./Add in optional attributes for either model

User.findById('1',{
	include:Project,as:'Tasks',attributes:['name']
})


E/ When creating many to many association we are provided with getter/setter methods
by sequelize.

set -setWorkers([]) -- used when initially creating an association and accepts an array of Ids
                       name of set and name of model 

add -addWorkers()  

get -getWorkers()   

remove -removeWorkers() 

Example syntax

Project.create({
	name:'project name'
}).then((project) => {
	project.setWorkers([1,2]);
})

