#!/usr/bin/node dev
const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) throw Error('Jobs is not an array');
  jobs.forEach((job) => {
    const pushNotification = queue.create('push_notification_code_3', job);
    pushNotification.save((err) => {
      if (!err) console.log(`Notification job created: ${pushNotification.id}`);
    });
    pushNotification.on('complete', () => {
      console.log(`Notification job ${pushNotification.id} completed`);
    });
    pushNotification.on('failed', (err) => {
      console.log(`Notification job ${pushNotification.id} failed: ${err}`);
    });
    pushNotification.on('progress', (progress) => {
      console.log(`Notification job ${pushNotification.id} ${progress}% complete`);
    });
  });
};

module.exports = createPushNotificationsJobs;
