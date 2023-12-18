const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const bookSeeds = require('./bookSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
    try {
        // await cleanDB('Book', 'books');
        await cleanDB('User', 'users');
        for (let i = 0; i < userSeeds.length; i++) {

            const { _id } = await User.create(userSeeds[i]);

            for (let j = 0; j < bookSeeds.length; j++) {
                console.log(bookSeeds[j])
                const user = await User.findOneAndUpdate(
                    { _id },
                    {
                        $addToSet: { savedBooks: bookSeeds[j] }
                    }
                );
            }
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('all done!');
    process.exit(0);
});