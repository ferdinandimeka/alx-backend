#!/usr/bin/node dev
import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

const updateHash = (hashName, key, value) => {
  client.hset(hashName, key, value, print);
};

const printHash = (hashName) => {
  client.hgetall(hashName, (err, res) => {
    console.log(res);
  });
};

function main() {
  const hashObj = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  for (const [key, value] of Object.entries(hashObj)) {
    updateHash('HolbertonSchools', key, value);
  }
  printHash('HolbertonSchools');
}
client.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});
