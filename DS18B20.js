'use strict';

const os = require('os');
const sensor = require('ds18b20-raspi');

exports.name = () => 'DS18B20';

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

exports.read = () => {
    return new Promise(function (resolve, reject) {
        sensor.readAllC((err, temps) => {
            if (err) {
                reject(err);
            } else {
                resolve(temps);
            }
        });
    })
        .then(res => {
            const record = { datetime: new Date(), devices: [] };
            for (const device of res) {
                record.devices.push({ id: `${os.hostname()}-ds18b20-${device.id}`, temperature: device.t })
            }

            return record;
        });
};
