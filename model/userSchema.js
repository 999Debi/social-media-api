import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    lastname: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 30,
    },
    password: {
      type: String,
      require: true,
    },
    
    friends: {
      type: Array, // array of user friends_ids
      default: [],
    },
    requestedFriend: {
      type: Array,
      default: [],
    },

    avatar:{
      type:String,
      default:"https://res.cloudinary.com/dcuvzhi86/image/upload/v1715671832/d7wk4gsl0oox3ulitdii.png"
    },

    avatarPublicId:{
      type:String,
      default:"d7wk4gsl0oox3ulitdii"
    },

    About: {
      type: Object,
      default: {
        Graduationyear: "",
        Specialization: "",
        Skills: "",
        Work: "",
        Clubs: "",
      },
    },
  },
  { timestamps: true }
);
const user = mongoose.model("user", userSchema);
export default user;
