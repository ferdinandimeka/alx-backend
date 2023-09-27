#!/usr/bin/node test
/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable jest/no-hooks */
/* eslint-disable no-undef */
import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job';

describe('createPushNotificationsJobs', () => {
  const spyUtils = sinon.spy(console);
  const KUE = createQueue({ name: 'push_notification_node_test' });

  before(() => {
    KUE.testMode.enter(true);
  });

  after(() => {
    KUE.testMode.clear();
    KUE.testMode.exit();
  });

  afterEach(() => {
    spyUtils.log.resetHistory();
  });

  it('displays an error message if jobs is not an array', () => {
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, KUE),
    ).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type', () => (done) => {
    expect(KUE.testMode.jobs.length).to.equal(0);
    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];
    createPushNotificationsJobs(jobInfos, KUE);
    expect(KUE.testMode.jobs.length).to.equal(2);
    expect(KUE.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(KUE.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    KUE.process('push_notification_code_3', () => {
      expect(
        spyUtils.log
          .calledWith('Notification job created:', KUE.testMode.jobs[0].id),
      ).to.be.true;
      done();
    });
  });

  it('registers the progress event handler for a job', () => (done) => {
    KUE.testMode.jobs[0].addListener('progress', () => {
      expect(
        spyUtils.log
          .calledWith('Notification job', KUE.testMode.jobs[0].id, '25% complete'),
      ).to.be.true;
      done();
    });
    KUE.testMode.jobs[0].emit('progress', 25);
  });

  it('registers the failed event handler for a job', () => (done) => {
    KUE.testMode.jobs[0].addListener('failed', () => {
      expect(
        spyUtils.log
          .calledWith('Notification job', KUE.testMode.jobs[0].id, 'failed:', 'Failed to send'),
      ).to.be.true;
      done();
    });
    KUE.testMode.jobs[0].emit('failed', new Error('Failed to send'));
  });

  it('registers the complete event handler for a job', () => (done) => {
    KUE.testMode.jobs[0].addListener('complete', () => {
      expect(
        spyUtils.log
          .calledWith('Notification job', KUE.testMode.jobs[0].id, 'completed'),
      ).to.be.true;
      done();
    });
    KUE.testMode.jobs[0].emit('complete');
  });
});
