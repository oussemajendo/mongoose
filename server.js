require('dotenv').config({ path: 'safe.env' });
const mongoose = require('mongoose');

const uri = process.env.DB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to the database');
    const Person = require('./models/users');

    const arrayOfPeople = [
      { name: 'Alice', age: 30, favoriteFoods: ['Sushi', 'Pasta'] },
      { name: 'Bob', age: 35, favoriteFoods: ['Burger', 'Steak'] },
      { name: 'Charlie', age: 40, favoriteFoods: ['Pizza', 'Tacos'] },
    ];

    try {
      // Create people
      const createdPeople = await Person.create(arrayOfPeople);
      console.log('People created:', createdPeople);

      // Find people with name "John"
      const people = await Person.find({ name: 'John' }).exec();
      console.log('People with name "John":', people);

      // Find person who likes Pasta
      const personOne = await Person.findOne({ favoriteFoods: 'Pasta' }).exec();
      console.log('Person who likes Pasta:', personOne);

      // Find person by ID
      const personId = '646688cd8c8e0e107f637ae5';
      const personById = await Person.findById(personId).exec();
      console.log('Person by ID:', personById);

      // Update person's favoriteFoods
      const personIdToUpdate = '646688cd8c8e0e107f637ae5';
      const personToUpdate = await Person.findById(personIdToUpdate).exec();
      if (personToUpdate) {
        personToUpdate.favoriteFoods.push('hamburger');
        await personToUpdate.save();
        console.log('Updated person:', personToUpdate);
      } else {
        console.log('Person not found');
      }

      // Update person's age
      const personNameToUpdate = 'John';
      const updatedPerson = await Person.findOneAndUpdate(
        { name: personNameToUpdate },
        { age: 20 },
        { new: true }
      ).exec();
      console.log('Updated person:', updatedPerson);

      // Delete person by ID
      const personIdToDelete = '646688cd8c8e0e107f637ae5';
      const deletedPerson = await Person.findByIdAndRemove(personIdToDelete);
      console.log('Deleted person:', deletedPerson);

      // Delete many persons by name
      const personNameToDelete = 'Alice';
      const result = await Person.deleteMany({ name: personNameToDelete });
      console.log('Deleted', result.deletedCount, 'people named', personNameToDelete);

      // Find people who like burritos
      const peopleWhoLikeBurritos = await Person.find({ favoriteFoods: 'burritos' })
        .sort('name')
        .limit(2)
        .select('-age')
        .exec();

      console.log('People who like burritos:', peopleWhoLikeBurritos);
    } catch (error) {
      console.error('Error:', error);
    }
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
