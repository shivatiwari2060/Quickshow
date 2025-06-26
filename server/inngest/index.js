import { Inngest } from "inngest";
import { User } from "../models/User.js";

// create a client to send and receive events
export const inngest = new Inngest({
  id: "movie-ticket-booking",
});

// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    // Here you would typically save the user data to your database
    await User.create(userData);
  }
);

// Ingest function to delete user data from database
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;
    // Here you would typically delete the user data from your database
    await User.findByIdAndDelete(id);
  }
);

// Ingest function to update user data in database
const syncUserUpdate = inngest.createFunction(
  {
    id: "sync-user-update-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    // Here you would typically update the user data in your database
    await User.findByIdAndUpdate(id, userData);
  }
);
// create an empty array where we'll export future inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
