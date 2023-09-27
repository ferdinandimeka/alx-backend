#!/usr/bin/node dev
import kue from 'kue';
import redis from 'redis';

const client = redis.createClient();
const queue = kue.createQueue({ name: 'push_notification_code' });

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const job = queue.create('push_notification_code', {
  phoneNumber: '09011591262',
  message: 'Account registered',
});

job
  .on('enqueue', () => {
    console.log('Notification job created:', job.id);
  })
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed attempt', () => {
    console.log('Notification job failed');
  });
job.save();
