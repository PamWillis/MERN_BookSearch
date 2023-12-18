const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
// const bookSeeds = require('./thoughtSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // await cleanDB('Book', 'books');
    await cleanDB('User', 'users');
    await User.create(userSeeds);
    
    // for (let i = 0; i < bookSeeds.length; i++) {
    //   const { _id, thoughtAuthor } = await Book.create(bookSeeds[i]);
    //   const user = await User.findOneAndUpdate(
    //     { username: thoughtAuthor },
    //     {
    //       $addToSet: {
    //         thoughts: _id,
    //       },
    //     }
    //   );
    // }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});