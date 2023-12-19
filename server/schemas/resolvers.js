const { User } = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const expiration = '2h';

const resolvers = {

  Query: {
    me: async (parent, args, context) => {

      return await User.findOne({ _id: context.user._id })
      // .populate('_id')

    }
  },


  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      // Create a user
      const user = await User.create({ username, email, password });
      // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Lookup the user by the provided email address, since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ email });
      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }
      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      const correctPW = await user.isCorrectPassword(password);
      // If the password is incorrect, return an Authentication error stating so
      if (!correctPW) {
        throw new AuthenticationError('Invalid email or password');
      }
      // If email and password are correct, sign the user into the application with a JWT
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    saveBook: async (parent, { userId, book }) => {

      return User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: { books: book },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },

    removeBook: async (parent, { usereId, book }) => {
      return User.findOneAndUpdate(
        { _id: userId },
        { 
          $pull: { books: book } 
        },
        { new: true }
      );
    },
  },
};

// function signToken({ email, username, _id }) {
//   const payload = { email, username, _id };
//   return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
// }

module.exports = resolvers;