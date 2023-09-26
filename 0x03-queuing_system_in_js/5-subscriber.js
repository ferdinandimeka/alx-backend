#!/usr/bin/node dev
import { createClient } from 'redis';

const client = createClient();
const EXIT_SUCCESS = 'KILL_SERVER';

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.subscribe('holberton school channel');

client.on('message', (channel, message) => {
  if (message === EXIT_SUCCESS) {
    client.unsubscribe();
    client.quit();
  } else {
    console.log(message);
  }
});
