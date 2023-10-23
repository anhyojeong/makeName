import { db } from './firebase.js';

const key = () => {
  return new Promise((resolve, reject) => {
    db.collection('apiKey').get().then((snapshots) => {
      const keys = [];
      snapshots.forEach((snapshot) => {
        const data = snapshot.data();
        keys.push(data);
      });
      resolve(keys);
    }).catch(error => {
      reject(error);
    });
  });
}

export {key};