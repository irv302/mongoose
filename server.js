const express = require("express");
const res = require("express/lib/response");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 3000;
const methodOverride = require("method-override");

const mongoose = require("mongoose");
const Product = require("./models/products");
mongoose.connect(process.env.DTABASE_URI, {
    // useNewUriParser: true,
    useUnifiedTopology: true,
});

const productSeed = require("./models/seed");
app.get("/products/seed", (req, res) => {
    Product.create(productSeed),
    (error, createdProductSeed) => {
        res.redirect("/products");
    }
});

const db = mongoose.connection;
db.on("error", (err) => console.log(`${err.message}   is mongo not running?`));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));




//Index
app.get("/products", (req, res) => {
    Product.find({}, (error, allProducts) => {
        res.render("index.ejs", {product: allProducts });
    });
});
//New
app.get("/products/new", (req, res) => {
    res.render("new.ejs");
});
//create
app.post("/products", (req, res) => {
    Product.create(req.body),
    (error, createdProduct) => {
        res.redirect("/products");
    };
});
//show
app.get("/products/:id", (req, res) => {
Product.findById(req.params.id, (err, foundProduct) => {
    res.render("show.ejs", {
        product: foundProduct,
    });
 });
});
//Edit
app.get("/products/:id/edit", (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render("edit.ejs", {
            product: foundProduct,
        });
     });
    });
    //Delete
    app.delete("/producs/:id", (req, res) => {
        Product.findByIdAndDelete(req.params.id, (err, data) => {
            res.redirect("/products");
        });
    });
    //update
    app.put("/products/:id", (req, res) =>{
        Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            },
            (error, updatedProduct) => {
                res.redirect(`${req.params.id}`);
            }
        );
    });
    //Buy
    app.post("/products/:id/buy", (req, res) => {
        Product.findById(req.params.id, (error, data) => { 
            if (data.qty === 0) {

            } else {
                data.qty--;
                data.save();
            }
            res.redirect("/products");
        });
    });

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});