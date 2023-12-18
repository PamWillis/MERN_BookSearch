const { User } = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const expiration = '2h';

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Check if the user is authenticated
      if (!context.user) {
        throw new Error('Authentication required');
      }
      // Assuming a simple database mock or ORM
      const userId = context.user.id;
      try {
        // Fetch user data from the database
        const userData = await database.getUserById(userId);
        // You might want to handle cases where the user is not found
        if (!userData) {
          throw new Error('User not found');
        }
        return userData;
      } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch user data');
      }
    },
    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
    users: async () => {
      return User.find();
    },
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
    addBook: async (parent, { profileId, book }, context) => {
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: profileId },
          {
            $addToSet: { books: book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      // If the user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError('Authentication required');
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        return User.findOneAndDelete({ _id: context.user._id });
      }
      throw new AuthenticationError('Authentication required');
    },
  },
};

function signToken({ email, username, _id }) {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = resolvers;