import { connect, JSONCodec } from "nats.ws";

import {
  NATS_SOCKET_URL,
  NATS_USERNAME,
  NATS_PASSWORD,
} from "../shared/constants";

// Declaring global variables
export let ns; // to store the NatsConnection instance
let isConnected = false; // to track the connection status

// Creating an EventEmitter instance for handling events

/**
 * Function to establish a connection to the WebSocket
 * @returns
 */
export const connectNatsWebSocket = async () => {
  if (isConnected) {
    return;
  }
  try {
    ns = await connect({
      servers: NATS_SOCKET_URL,
      user: NATS_USERNAME,
      pass: NATS_PASSWORD,
    });
    onConnect();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Function called upon successful connection
 */
const onConnect = () => {
  isConnected = true;
  console.log("WS Connected");
  subscribeAllTopics();
};

export const disconnect = () => {
  if (!isConnected) {
    return;
  }
  console.log("disconnected");
  unsubscribe();
  isConnected = false;
};

/**
 * Function to subscribe to a specific topic
 * @param topic
 */
export const subscribe = (topic) => {
  if (!isConnected) {
    throw new Error("WebSocket is not connected");
  }
  const codec = JSONCodec(); // Create a JSON codec for encoding/decoding messages
  console.log(`subscribed ${topic}`);

  // Subscribe to the specified topic with the user's email as part of the topic name
  ns.subscribe(`${topic}`, {
    callback: (err, msg) => {
      // Decode the received message data and Emit an event with the received data
      const data = codec.decode(msg.data);
      console.log("received message: ", data);
    },
  });

  //Publish on topic
  ns.publish("myTopic", codec.encode("Hello Nats!"));
};

/**
 * Function to subscribe to all predefined topics
 */
export const subscribeAllTopics = () => {
  subscribe("myTopic");
};

/**
 * Function to unsubscribe from all topics
 */
export const unsubscribe = async () => {
  try {
    await ns.close();
  } catch (error) {
    console.error(error);
  }
};
