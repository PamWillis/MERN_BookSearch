const { User } = require('../models');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
       me: async () => {
            return await User.find({}).populate('users')
        }
    },
    // Define the functions that will fulfill the mutations
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new Error('Invalid email or password');
            }
      
            const isPasswordValid = await user.isCorrectPassword(password);
      
            if (!isPasswordValid) {
              throw new Error('Invalid email or password');
            }
      
            const token = jwt.sign({ email: user.email, _id: user._id }, 'your-secret-key', { expiresIn: '1h' });
      
            return { user, token };
          },
          // Other mutations...
        addUser: async (parent, { username, email, password }) => {
            // Create and return the new User object
            return await User.create({ username, email, password });
        },
        addBook: async (parent, { author, description, title, _bookid, image, link }) => {
            // Create and return the new Book object
            return await Book.create({ author, description, title, _bookid, image, link });
        },
        removeBook: async (parent, { _bookid }) => {
            // Delete Book object
            return await Book.remove({ author, description, title, _bookid, image, link });
        },
    },
};




module.exports = resolvers;