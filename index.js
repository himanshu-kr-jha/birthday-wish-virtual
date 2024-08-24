const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const flash = require('connect-flash');
const bodyParser = require('body-parser');

// Dummy user store
const users = [
  {
    username: 'singleUser', // Hard-coded username
    password: bcrypt.hashSync('password123', 10) // Hard-coded password
  }
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/js")));
app.engine("ejs", ejsMate);

// Set up session
app.use(session({
  secret: 'yourSecretKey', // Change this to a random string
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: true }));

// app.js
const sendMail = require('./mail');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return done(err);
      if (result) return done(null, user);
      else return done(null, false, { message: 'Incorrect password.' });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = users.find(u => u.username === username);
  done(null, user);
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You need to log in first.');
  res.redirect("/questions");
}

// Routes
app.get("/", isAuthenticated, (req, res) => {
  res.render("home.ejs");
});
app.get("/submit", (req, res) => {
    res.render("submission.ejs");
  });
  app.post('/send-feedback', (req, res) => {
    const { question1, question2, question3} = req.body;
    const answers = `
      Its a ${question1}
      -> ${question2}
      -> ${question3}
    `;
  
    sendMail(process.env.EMAIL_USER, 'Romantic Questions Answers', answers);
    res.redirect("/submit");
  });
  
app.get("/questions", (req, res) => {
  res.render("questions.ejs");
});

app.post("/check-answers", (req, res) => {
  const { question1, question2 } = req.body;

  // Define the correct answers
  const correctAnswers = {
    question1: '4',
    question2: '4',
    question3: '3',
    question4: '3',
    question5: '3',
    question6: '2'
  };

  // Check if the answers are correct
  if (question1 === correctAnswers.question1 && question2 === correctAnswers.question2) {
    req.login(users[0], (err) => { // Log in the user
      if (err) return next(err);
      res.redirect("/");
    });
  } else {
    req.flash('error', 'Incorrect answers. Please try again.');
    res.redirect("/questions");
  }
});

app.get("/first", (req, res) => {
  res.render("wheeloflove.ejs");
});

app.get("/wish", (req, res) => {
  res.render("index.ejs");
});

app.get("/treewish", (req, res) => {
  res.render("treewish.ejs");
});

app.get("/feedback", (req, res) => {
    res.render("feedback.ejs");
  });
  

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
  });
  