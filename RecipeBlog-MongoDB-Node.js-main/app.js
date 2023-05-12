const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const User = require("./server/models/user");
// const auth = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Category = require('./server/models/Category');
const Recipe = require('./server/models/Recipe');


const app = express();
const port = process.env.PORT || 3005;
// bodyParser.urlencoded used to parse incoming request bodies in a middleware before your handlers, available under the req.body property. 
const urlencodedParser = bodyParser.urlencoded({ extended: false })

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
// app.set('layout', './register');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes);

// app.post('/loginpage', urlencodedParser, (req, res)=> {
//   console.log(req.body);
// })

// app.post("/loginpage", async (req, res) => {
//   try {
//     // Get user input
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );

//       // save user token
//       user.token = token;

//       // user
//       res.status(200).json(user);
//     }
//     res.status(400).send("Invalid Credentials");
//   } catch (err) {
//     console.log(err);
//   }
// });


app.post("/loginpage", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        "Punam",
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      // res.status(200).json("Login sucessfully");
      const limitNumber = 5;
      const categories = await Category.find({}).limit(limitNumber);
      const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
      const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
      const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
      const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
  
      const food = { latest, thai, american, chinese };
  
      res.render('index', { title: 'Cooking Blog - Home', categories, food } );
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// app.get('/home', function(req, res)=>{
//   response.sendFile(__dirname+'/home.html');
//   })
 
// app.get('/js/index.js', function(req, res) { 
//   res.render('index'); 
// });

app.post("/registerpage", async (req, res) => {
  try {
    // Get user input
    // const { first_name, last_name, email, password } = req.body;

  const { username, email, password, password1 } = req.body;

    console.log(req.body);
    // Validate user input
    if (!(username && email && password && password1)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    
    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username, 
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      "Punam",
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    // res.status(201).json(user);
    res.render('login', { title:"login" } );
  } catch (err) {
    res.status(400).send("User already exist");
    //assuming app is express Object.

    console.log(err);
  }
});

app.listen(port, ()=> console.log(`Listening to port ${port}`));

