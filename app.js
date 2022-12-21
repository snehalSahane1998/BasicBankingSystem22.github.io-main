const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sparks', { useNewUrlParser: true }, { useUnifiedTopology: true });

const customerService = require('./static/customer');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("yes we are connected!");
});
const port = 8000;

//Define mongoose schema
let formSchema = new mongoose.Schema({
    Sender_Name: String,
    Receiver_Name: String,
    Amount: String
});

let customerSchema = new mongoose.Schema({
    Customer_Name: String,
    Email: String,
    User_Name: String,
    Balance: Number
});

formSchema.methods.speak = function () {
    let greeting = "Data successfully saved to database"
    console.log(greeting);
}

customerSchema.methods.speak = function () {
    let greeting = "Data successfully saved to database"
    console.log(greeting);
}

const Form = mongoose.model('Form', formSchema);
const Customer = mongoose.model('Customer', customerSchema);

//EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'))           //for serving static files      
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//PUG SPECIFIC STUFF
app.set('view engine', 'pug')                       //set the template engine as pug
app.set('views', path.join(__dirname, 'views'))            //set the view directory

//ENDPOINTS
app.get('/', (req, res) => {
    const params = {};
    res.status(200).render('index.pug', params);
})

app.get('/ViewCustomers', async (req, res) => {
    let customers = await Customer.find({});

    res.status(200).render('customer.pug', { customers: customers });
});

app.get('/newCustomerForm', (req, res) => {
    const params = {};
    res.status(200).render('addCustomer.pug', params);
});

app.post('/sendMoney', async (req, res) => {
    
    let data = req.body;
    data.Amount = parseFloat(data.Amount)
    
    let sender = await Customer.findOne({ "User_Name": data.Sender_Name });
    let reciver = await Customer.findOne({ "User_Name": data.Receiver_Name });
    
    if (!sender) {
        console.log("Sender not present.");
        return res.redirect('/ViewCustomers');
    }
    if (!reciver) {
        console.log("Reciver not present.");
        return res.redirect('/ViewCustomers')
    }

    await Customer.updateOne({User_Name: sender.User_Name}, {Balance: sender.Balance < data.Amount ? sender.Balance : sender.Balance - data.Amount});
    await Customer.updateOne({User_Name: reciver.User_Name}, {Balance: sender.Balance < data.Amount ? reciver.Balance : reciver.Balance + data.Amount});
    await Form(req.body).save();
    return res.redirect('/ViewCustomers')

})

app.post('/addCustomer', (req, res) => {
    let myData = new Customer(req.body);
    myData.save(function (err, H) {
        if (err) return console.error(err);
        H.speak();
    })
    res.redirect('/newCustomerForm')

});

//START THE SERVER
app.listen(port, () => {
    console.log(`The application has started successfully on port ${port}`);
})