#!/usr/bin/node dev
import kue from 'kue';
import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const queue = kue.createQueue({ name: 'push_notification_code' });

const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

queue.on('error', (err) => {
  console.log(`Notification job failed: ${err}`);
});
