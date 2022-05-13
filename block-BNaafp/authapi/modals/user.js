var mongoose = require("mongoose");
var schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema = new schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 5, required: true },
  },
  { timestamps: true }
);

// bcrypt password
userSchema.pre("save", async function (next) {
  // console.log(this ,'inside pre save')
  try {
    //hasing the password
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hashSync(this.password, 10);
    }
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.verifyPassword = async function (password, cb) {
  try {
    var result = await bcrypt.compareSync(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

var User = mongoose.model("User", userSchema);
module.exports = User;
