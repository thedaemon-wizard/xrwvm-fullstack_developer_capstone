/* jshint esversion: 8 */
// ↑ ES8のasync/awaitをサポートするために必要なJSHintディレクティブ

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');  // セミコロン追加
const app = express();  // セミコロン追加
const port = 3030;
app.use(cors());  // セミコロン修正済み
app.use(require('body-parser').urlencoded({ extended: false }));
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));
mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});
const Reviews = require('./review');
const Dealerships = require('./dealership');
try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data.reviews);  // ドット表記に変更
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data.dealerships);  // ドット表記に変更
  });
  
} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}
// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");  // セミコロン追加
});
// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});
// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});
// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
//Write your code here
try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});
// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
//Write your code here
    try {
        const documents = await Dealerships.find({state: req.params.state});
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});
// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
//Write your code here
try {
    const documents = await Dealerships.find({id: req.params.id});
    res.json(documents);
} catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
}
});
//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  const data = JSON.parse(req.body);  // constを追加、セミコロン追加
  let new_id = documents[0].id+1;  // ドット表記に変更、セミコロン追加
  const review = new Reviews({
    "id": new_id,
    "name": data.name,  // ドット表記に変更
    "dealership": data.dealership,  // ドット表記に変更
    "review": data.review,  // ドット表記に変更
    "purchase": data.purchase,  // ドット表記に変更
    "purchase_date": data.purchase_date,  // ドット表記に変更
    "car_make": data.car_make,  // ドット表記に変更
    "car_model": data.car_model,  // ドット表記に変更
    "car_year": data.car_year,  // ドット表記に変更
  });
  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);  // テンプレートリテラルはES6
});
