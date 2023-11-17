'use strict';

const os = require('os');
const fetch = require('node-fetch');

exports.name = () => 'NatureRemo';

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

exports.read = () => {
    return fetch('https://api.nature.global/1/devices', {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NatureRemoToken}`
        },
    })
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`response status is ${res.status}`);
            }
            return res.text();
        })
        .then(text => {
            return JSON.parse(text);
        })
        .then(json => {
            const records = [];

            json.forEach(device => {
                const record = {
                    datetime: new Date(device.created_at),
                    device: device.id,
                    values: {}
                };

                if (device.newest_events.te) {
                    record.values.temperature = device.newest_events.te.val + device.temperature_offset;
                }
                if (device.newest_events.hu) {
                    record.values.humidity = device.newest_events.hu.val + device.humidity_offset;
                }
                if (device.newest_events.il) {
                    record.values.illumination = device.newest_events.il.val;
                }
                if (device.newest_events.mo) {
                    record.values.movement = device.newest_events.mo.val;
                }

                records.push(record)
            })

            return records;
        });
};
