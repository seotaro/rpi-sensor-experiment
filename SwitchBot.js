'use strict';

const os = require('os');
const fetch = require('node-fetch');
const crypto = require('crypto');

exports.name = () => 'SwitchBot';

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

const makeHeader = () => {
    const t = Date.now();
    const nonce = crypto.randomUUID();
    const data = process.env.SwitchBotToken + t + nonce;
    const signTerm = crypto.createHmac('sha256', process.env.SwitchBotSecret)
        .update(Buffer.from(data, 'utf-8'))
        .digest();
    const sign = signTerm.toString("base64");

    return {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf8',
        Authorization: `${process.env.SwitchBotToken}`,
        sign: sign,
        nonce: nonce,
        t: t,
    }
}

const fetchDevices = () => {
    return fetch('https://api.switch-bot.com/v1.1/devices', {
        method: "GET",
        headers: makeHeader(),
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
            return json.body.deviceList;
        });

}

const fetchStatus = (device) => {
    return fetch(`https://api.switch-bot.com/v1.1/devices/${device}/status`, {
        method: "GET",
        headers: makeHeader(),
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
            return json;
        });

}

exports.read = async () => {
    const devices = await fetchDevices();
    console.log(devices);

    const device = devices[0];
    const status = await fetchStatus(device.deviceId);
    console.log(status.statusCode, status.body);

    const records = [];
    return records;

    //     const datetime = new Date();
    //     const records = [];
    //     console.log(json);
    //     // API から返ってきた時刻にしているが、実際の計測時刻は各要素の created_at であることに注意。ハンドリングしづらい。
    //     json.forEach(device => {
    //         const record = {
    //             datetime,
    //             device: `switchbot-${device.serial_number}`,
    //             values: {},
    //         }

    //         if (device.newest_events.te) {
    //             record.values.temperature = device.newest_events.te.val + device.temperature_offset;
    //         }
    //         if (device.newest_events.hu) {
    //             record.values.humidity = device.newest_events.hu.val + device.humidity_offset;
    //         }
    //         // if (device.newest_events.il) {
    //         //     record.values.illumination = device.newest_events.il.val;
    //         // }
    //         // if (device.newest_events.mo) {
    //         //     record.values.movement = device.newest_events.mo.val;
    //         // }
    //         records.push(record)
    //     })
    //     return records;
};
