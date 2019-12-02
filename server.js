const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');

const {linkedInLogin, linkedInToken } = require('./helpers');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const router = express.Router();



router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/login', (req, res) => {
    linkedinLogin(req, res);
})


router.get('/linkedInToken', (req, res) => {
  linkedInToken(req, res)
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);