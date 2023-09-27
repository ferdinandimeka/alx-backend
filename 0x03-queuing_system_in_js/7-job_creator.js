#!/usr/bin/node dev
import kue from 'kue';
import redis from 'redis';

const client = redis.createClient();

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account',
  },
];

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const queue = kue.createQueue();

for (const job of jobs) {
  const newJob = queue.create('push_notification_code_2', job).save((err) => {
    if (!err) console.log(`Notification job created: ${newJob.id}`);
  });

  newJob.on('complete', () => {
    console.log(`Notification job ${newJob.id} completed`);
  });

  newJob.on('failed', (err) => {
    console.log(`Notification job ${newJob.id} failed: ${err}`);
  });

  newJob.on('progress', (progress) => {
    console.log(`Notification job ${newJob.id} ${progress}% complete`);
  });
}
