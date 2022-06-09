const req = require("express")
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

const mongoose = require("mongoose");
const Product = require("./modles/product");
mongoose.connect(process.env.DTABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
