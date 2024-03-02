import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@utlis/database';
import User from '@models/user';

// Define the handler function for NextAuth
const handler = NextAuth({
  providers: [
    // Set up Google provider with client ID and client secret
    GoogleProvider({
      clientId: 'process.env.GOOGLE_ID',
      clientSecret: 'process.env.GOOGLE_SECRET',
    }),
  ],
  // Function to handle session data
  async session({ session }) {
    const sessionUser = await User.findOne({
      email: session.user.email,
    });
    // Set the user id in the session
    session.user.id = sessionUser._id.toString();

    return session;
  },

  // Function to handle user sign-in
  async signIn({ profile }) {
    try {
      await connectToDB();

      //Check if User Already Exists
      const userExists = await User.findOne({
        email: profile.email,
      });

      //If not create a new user
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(' ', '').toLowerCase(),
          image: profile.picture,
        });
      }

      return true;
    } catch (error) {
      // Log any errors that occur during sign-in
      console.log(error);
      return false;
    }
  },
});

// Export the handler function for both GET and POST requests
export { handler as GET, handler as POST };
