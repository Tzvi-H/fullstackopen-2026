const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const [, , password, name, number] = process.argv;
const url = `mongodb+srv://username:${password}@cluster0.xcuotfg.mongodb.net/persons?appName=Cluster0`;

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((p) => console.log(p.name, p.number));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then(({ name, number }) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
