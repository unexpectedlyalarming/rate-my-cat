//Cat schema. Includes information like name, breed, color, age, reference to users, and image.

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  color: { type: String, required: true },
  age: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String, required: true },
});

const Cat = mongoose.model("Cat", catSchema);
