const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
var path = require('path');
//var popup = require('popups');
let ejs = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
//const sc = require('./errorScript.js');
app.set('view engine', 'ejs');
app.use(express.json());

app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

//let currUser = "";
// var currBooks = [];
//   for( var i = 0 ;  i<booksDB.length; i++)
//  if(booksDB[i].username = req.session.user)
//    currBooks = booksDB[i].books;
//////////////////// 
//we need to set a variable to store username in current session 
// whenever  the users adds a book to her/her readlist , the database is updated 
// when the user goes to the read list , the page either renders or filters the books in the database with the uesername 
// the user can also remove a book from the readlist - supposedly 
app.use( session({
  name : 'sid',
 secret : 'key' ,
 resave : false,
 saveUninitialized : false ,
 cookie : {
  path : '/' , 
  httpOnly : false ,
  maxAge : 1000 * 60 * 60 * 24 * 20
 } ,
}));

app.use(bodyParser.urlencoded({
  extended : true
}));


let database = JSON.parse(fs.readFileSync("user.json"));

let booksDB = JSON.parse(fs.readFileSync("userWantToRead.json"));

const redirectLogin = (req , res , next) => {
  if(!req.session.userId){
    res.redirect('login');  
  }
  else {
    next();
  }
}

const redirectHome = (req , res , next) => {
  if(req.session.userId){
    res.redirect('home');  
  }
  else {
    next();
  }
}

// let currBooks = []; has to be a local variable 
// for( var i = 0 ;  i<booksDB.length; i++)
//  if(booksDB[i].username = currUser)
//    currBooks = booksDB[i].books;

app.get('/home', redirectLogin ,  (req, res) => {
  res.render('home.ejs' , {
    Name : req.session.userId
  });
  //res.send('Hello World!')

});



app.get('/', (req, res) => {
  res.render('login.ejs', {
    ErrorMessage:""  
    });
  //res.send('Hello World!')

});

app.get('/login', redirectHome ,  (req, res) => {
  res.render('login.ejs', {
    ErrorMessage:""  
    });
  //res.send('Hello World!')

});

app.get('/dune', (req, res) => {
  res.render('dune.ejs', {
    DoneMessage:""

  });
  //res.send('Hello World!')

});

app.get('/fiction', (req, res) => {
  res.render('fiction.ejs');
  //res.send('Hello World!')

});
app.get('/flies', (req, res) => {
  res.render('flies.ejs' , {
    DoneMessage:""

  } );
  //res.send('Hello World!')

});
app.get('/grapes', (req, res) => {
  res.render('grapes.ejs',{
    DoneMessage:""
  });  //res.send('Hello World!')

});

app.get('/leaves', (req, res) => {
  res.render('leaves.ejs', {
    DoneMessage:""

  });
  //res.send('Hello World!')

});

app.get('/mockingbird', (req, res) => {
  res.render('mockingbird.ejs', {
    DoneMessage:""

  });
  //res.send('Hello World!')

});
app.get('/novel', (req, res) => {
  res.render('novel.ejs');
  //res.send('Hello World!')

});

app.get('/poetry', (req, res) => {
  res.render('poetry.ejs');
  //res.send('Hello World!')

});
app.get('/readlist', (req, res) => {
   var user = req.session.userId;
   const result = booksDB.find( users => users.username === user )
  // console.log(result); ["The Grapes of Wrath","Lord of the Flies"]
  console.log(req.session.userId);
  if(!result)
  res.render('readlist.ejs' , {
    Books : ''
  });

  else
  res.render('readlist.ejs' , {
    Books : result.books
  });
  //res.send('Hello World!')

});

app.post('/readlist', (req, res) => {
  // var user = req.session.userId;
  // const result = booksDB.find( users => users.username === user )
  // console.log(result);
  res.render('readlist.ejs' , {
    Books : ["The Grapes of Wrath","Lord of the Flies"]
  });
  //res.send('Hello World!')

});

app.get('/registration', (req, res) => {
  res.render('registration.ejs', {
    ErrorMessage:""  
    });
  //res.send('Hello World!')

});

app.get('/searchresults', (req, res) => {
  res.render('searchresults.ejs',{
    Name : req.body.Search
  });
  //res.send('Hello World!')

});

app.get('/sun', (req, res) => {
  res.render('sun.ejs', {
    DoneMessage:""

  });
  //res.send('Hello World!')

});


// //var alert = window['alert'];
// const notifier = require('node-notifier');
// // String
// notifier.notify('Message');
// notifier.notify({
//   title: 'ERROR',
//   message: 'USERNAME ARLEADY DEFINED'
// });
// // Object


app.post('/register' , (req,res)=>{
 var x = req.body.username;
 var y = req.body.password;
 var i;
  for(  i = 0; i<database.length ; i++ ){
      if(database[i].username === x){
     
   return res.render('registration.ejs', {
    ErrorMessage:"Username is taken"  
    });
  }
    };
 // let newArr = JSON.parse(fs.readFileSync("user.json"));
  database.push({ username:x , password:y });
  fs.writeFileSync("user.json",JSON.stringify(database));
 // currUser = x;
  req.session.userId = x;
  //req.session.currBooks = [];
  res.redirect('/home');
  //console.log( 'length inside' + database.length);
}  );


app.post('/login' , (req,res)=>{
  var x = req.body.username;
  var y = req.body.password;
  var i;
  let noUser= true;
  let wrongUser=  true;
   for(  i = 0; i<database.length ; i++ ){
       if(database[i].username === x &&  database[i].password === y)
       {
        noUser = false;
        // console.log("true");
       // currUser = x;
       req.session.userId = database[i].username;
        console.log(req.session);
      //  console.log(req.sessionID);
        return res.redirect('/home' );
       }
      // if(database[i].username === x &&  database[i].password != y)
      // {
      //   res.redirect('/login');
      // // error
      // }
      
     };
   if(noUser){
    //  console.log("here")
   res.render('login',{
     ErrorMessage:"Wrong UserName or Password"
   });
  }
 }  );
 

 app.post('/grapes' ,(req,res) =>{
  // console.log(req.session);
  
   var user  = booksDB.find( user => user.username === req.session.userId )
   if(!user){
     console.log('it is here');
    booksDB.push( {username : req.session.userId , books : ['The Grapes of Wrath'] } );
    fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
    res.render('grapes.ejs',{
      DoneMessage:"Book Added to List"
    });
   }
   else {
     if( user.books.includes( 'The Grapes of Wrath' ) ) {
      res.render('grapes.ejs',{
        DoneMessage:"Book Arleady exists in your want to read list"
      });    
     }
     else {
        booksDB[ booksDB.indexOf( user ) ].books.push( 'The Grapes of Wrath' );
        fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
        res.render('grapes.ejs',{
          DoneMessage:"Book Added to List"
        });
     }

   }


//   var currBooks = [];
//   for( var i = 0 ;  i<booksDB.length; i++){
//     //console.log(booksDB[i].username);
//  if(booksDB[i].username = req.session.userId)
//    currBooks = booksDB[i].books;
//   }
//   // console.log(currBooks);
//    // make loop inside a function 
//    let currUser = req.session.userId;
//  addBookToDb ('The Grapes of Wrath' , currBooks, currUser);
  
//   fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));

  // res.render('grapes.ejs',{
  //   DoneMessage:"Book Added to List"
  // });



 }  );

 
 app.post('/flies' ,(req,res) =>{

  console.log(req.session);
  
   var user  = booksDB.find( user => user.username === req.session.userId )
   if(!user){
     console.log('it is here');
    booksDB.push( {username : req.session.userId , books : ['Lord of the Flies'] } );
    fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
    res.render('flies.ejs',{
      DoneMessage:"Book Added to List"
    });
   }
   else {
     if( user.books.includes( 'Lord of the Flies' ) ) {
      res.render('flies.ejs',{
        DoneMessage:"Book Arleady exists in your want to read list"
      });    
     }
     else {
        booksDB[ booksDB.indexOf( user ) ].books.push( 'Lord of the Flies' );
        fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
        res.render('flies.ejs',{
          DoneMessage:"Book Added to List"
        });
     }

   }
//    console.log('post flies');
//   var currBooks = [];
//   for( var i = 0 ;  i<booksDB.length; i++){
//     console.log(booksDB[i].username);
//  if(booksDB[i].username = req.session.userId)
//    currBooks = booksDB[i].books;
//   }
//   // console.log(currBooks);
//    // make loop inside a function 
//    let currUser = req.session.userId;
//  addBookToDb ('Lord of the Flies' , currBooks, currUser);
  
//   fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));

//   res.render('flies.ejs',{
//     DoneMessage:"Book Added to List"
//   });



 }  );

app.use('/css', express.static(__dirname + 'public/css'))



if(process.env.PORT){
  app.listen(process.env.PORT , function () { console.log('Server Started')});
}

else { 
app.listen(port, () => {
  console.log(` App listening at http://localhost:${port}`);
})
}




 function addBookToDb  ( x , currBooks , currUser)  {
   
  if( !currBooks.includes(x) )
  currBooks.push(x);
  console.log(currBooks);
// booksDB.push( { username : currUser , books: currBooks }  );
if(booksDB.length === 0){
 booksDB.push( { username : currUser , books: currBooks }  );
 console.log("entered");
}
 else {
   var flag = true;
   console.log("entered2");

   for  (var i = 0 ; i<booksDB.length ; i++){
   // console.log(booksDB[i].username);

     if(booksDB[i].username === currUser){
       booksDB[i].books = currBooks;
           flag = false;
           console.log(flag);
     }
   }
   console.log(flag);

   if(flag)
   booksDB.push( { username : currUser , books: currBooks }  );

 }
 return null;
}





app.post('/logout' , (req,res)=>{
  console.log(req.session);
   req.session.destroy(err=>{
     res.clearCookie('sid');
     res.redirect('/login');
   })

});

app.post( '/search' , (req,res)=>{

  let s = req.body.Search;

res.render('searchresults.ejs' , {
  Name : s
});


} );



app.post('/leaves' ,(req,res) =>{

  // console.log('hereeeeee');
  // console.log(req.session);
  
   var user  = booksDB.find( user => user.username === req.session.userId )
   if(!user){
     console.log('it is here');
    booksDB.push( {username : req.session.userId , books : ['Leaves of Grass'] } );
    fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
    res.render('leaves.ejs',{
      DoneMessage:"Book Added to List"
    });
   }
   else {
     if( user.books.includes( 'Leaves of Grass' ) ) {
      res.render('leaves.ejs',{
        DoneMessage:"Book Arleady exists in your want to read list"
      });    
     }
     else {
        booksDB[ booksDB.indexOf( user ) ].books.push( 'Leaves of Grass' );
        fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
        res.render('leaves.ejs',{
          DoneMessage:"Book Added to List"
        });
     }

   }
  }
);





app.post('/dune' ,(req,res) =>{

  // console.log('hereeeeee');
  // console.log(req.session);
  
   var user  = booksDB.find( user => user.username === req.session.userId )
   if(!user){
     console.log('it is here');
    booksDB.push( {username : req.session.userId , books : ['Dune'] } );
    fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
    res.render('dune.ejs',{
      DoneMessage:"Book Added to List"
    });
   }
   else {
     if( user.books.includes( 'Dune' ) ) {
      res.render('dune.ejs',{
        DoneMessage:"Book Arleady exists in your want to read list"
      });    
     }
     else {
        booksDB[ booksDB.indexOf( user ) ].books.push( 'Dune' );
        fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
        res.render('dune.ejs',{
          DoneMessage:"Book Added to List"
        });
     }

   }
  }
);





app.post('/mockingbird' ,(req,res) =>{

  // console.log('hereeeeee');
  // console.log(req.session);
  
   var user  = booksDB.find( user => user.username === req.session.userId )
   if(!user){
     console.log('it is here');
    booksDB.push( {username : req.session.userId , books : ['To Kill a Mockingbird'] } );
    fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
    res.render('mockingbird.ejs',{
      DoneMessage:"Book Added to List"
    });
   }
   else {
     if( user.books.includes( 'To Kill a Mockingbird' ) ) {
      res.render('mockingbird.ejs',{
        DoneMessage:"Book Arleady exists in your want to read list"
      });    
     }
     else {
        booksDB[ booksDB.indexOf( user ) ].books.push( 'To Kill a Mockingbird' );
        fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
        res.render('mockingbird.ejs',{
          DoneMessage:"Book Added to List"
        });
     }

   }
  }
);



app.post('/sun' ,(req,res) =>{

  // console.log('hereeeeee');
  // console.log(req.session);
  
   var user  = booksDB.find( user => user.username === req.session.userId )
   if(!user){
     console.log('it is here');
    booksDB.push( {username : req.session.userId , books : ['The Sun and Her Flowers'] } );
    fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
    res.render('sun.ejs',{
      DoneMessage:"Book Added to List"
    });
   }
   else {
     if( user.books.includes( 'The Sun and Her Flowers' ) ) {
      res.render('sun.ejs',{
        DoneMessage:"Book Arleady exists in your want to read list"
      });    
     }
     else {
        booksDB[ booksDB.indexOf( user ) ].books.push( 'The Sun and Her Flowers' );
        fs.writeFileSync("userWantToRead.json",JSON.stringify(booksDB));
        res.render('sun.ejs',{
          DoneMessage:"Book Added to List"
        });
     }

   }
  }
);









