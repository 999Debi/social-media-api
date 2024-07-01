import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// npm package
import helmet from "helmet";

import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import bodyParser from "body-parser";


import express from "express";
const app = express();

import connectDB from "./db/connect.js";

//router import
import authrouter from "./routes/auth.js";
import userrouter from "./routes/users.js";
import postrouter from "./routes/posts.js";


//controlers import
import { createpost } from "./controler/posts.js";
import { Register ,updateUser} from "./controler/auth.js";


//middleware
import verifytoken from "./middleware/auth.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";


// extra packages
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());








//file storag
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//  Routes with files
app.post("/auth/register", upload.single("picture"), Register);
app.post("/auth/updateUser", verifytoken, upload.single("picture"), updateUser);

app.post("/posts", verifytoken, upload.single("picture"), createpost);

//Routes
app.use("/auth", authrouter);
app.use("/users", userrouter);
app.use("/posts", postrouter);

app.get("/", function (request, response) {
  response.send("hello");
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3006;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
