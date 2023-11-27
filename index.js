import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import pg from "pg";
import axios from "axios";
import {myApication, connectData} from "./file.js";

const api = myApication();
const app = express();
const port = 3000;
const dataNews = connectData();

// const apiKey = api; //This is a apikey for newsApi

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Client(dataNews);

db.connect();

let countryCode = "us";
app.get("/", async(req, res) =>{
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${api}`);
    const datas = response.data.articles;
    let listData = [];
    datas.forEach(data =>{
        listData.push(data);
    })
    // console.log(listData);
    // const lenghtTotal = response.data.articles.length;
    const comment = await db.query("SELECT * FROM comentaire");

    res.render("index.ejs", {newData: listData});
})
// app.get("/contact", (req, res) =>{
//     res.render("form.ejs");
// })

app.post("/country", (req, res)=>{
    const country = req.body.lang;
    countryCode = country;
    res.redirect("/")
    
    
})


app.listen(port, ()=>{
    console.log(`This server is running on ${3000}`);
})