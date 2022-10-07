const express = require('express');
const mongoose = require('mongoose')
const crypto = require('crypto')
const hash = crypto.createHash('sha1')
const app = express();
const port = process.env.PORT || 4242;
const connect = require('./db.js')
const bodyParser = require('body-parser');
const { restart } = require('nodemon');
app.set ('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

const Schema = {
    name: { type: String,min: 5, max:20, required: true ,unique: true },
    email: { type: String, required: true , unique:  true},
    mdp: { type: String,min: 5, max:20, required: true },
    type: {type:Boolean, required : true }
  };
  const Register = mongoose.model("register", Schema) // verifie sur les information envoyer corresponde au schema
// Register fait le lien avec la base de données


app.get('/register', (req, res) => {
    
    res.render("register")
    //console.log(req.body.nom)
});
app.get('/login',(req, res)=>{
    
    res.render("login")
})
app.get('/home',(req,res)=>{
    res.render('login')
    
})
app.post('/login', async (req,res) =>{
    const name = req.body.nom
    const data = hash.update(req.body.password)
    const mdp = data.digest('hex')
    console.log(name,mdp)
   const user = Register.findOne({name, mdp})
   Register.count({name,mdp}, function( err, count){
    console.log( "Number of users:", count );
    if(count == 1)
    {
        res.render('home',{name: name}) // tu renvoie vers home avec la variable nom  qui pourra donc etre utilisé dans le fichier ejs
    }
    else
    res.render('login')
})
   //console.log(user)
   //Register.count({ name: name, mdp: mdp}) ,async function( err, count)
   // {
   //     
   //     if(err)
   //     {
   //         console.log("dans le if")
   //         throw err
   //     }
   //     else
   //    await console.log( "Number of users:",count);
   // }
})

app.post('/register', function (req,res) 
{

    if(req.body.password !== req.body.passwordVerif)
    {
        const error = "Y'a une diff fro"
        throw error 
    }
    else
    {
        data = hash.update(req.body.password)
        data_hash=data.digest('hex')
        const user = new Register
        ({
            name : req.body.nom,
            email : req.body.email,
            mdp : data_hash,
            type : false,
        })
        user.save(function(err)
        {
            if(err)
            {
                throw err
            }
        else
        res.render('login',)
        })
    }

    //res.render("register")
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});