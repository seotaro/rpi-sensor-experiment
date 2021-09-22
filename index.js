'use strict';

require('dotenv').config();

let sensors = [];
if (process.env.BME280) {
    const BME280 = require('./BME280');
    sensors.push(BME280);
}
if (process.env.SHT31) {
    const SHT31 = require('./SHT31');
    sensors.push(SHT31);
}
if (process.env.DS18B20) {
    const DS18B20 = require('./DS18B20');
    sensors.push(DS18B20);
}
if (process.env.NatureRemo) {
    const NatureRemo = require('./NatureRemo');
    sensors.push(NatureRemo);
}


console.log(`interval: ${process.env.INTERVAL} [ms], publish to: ${process.env.TOPIC}`);
sensors.forEach(x => {
    console.log(`${x.name()}: use`);
})

const initialize = async (sensor) => {
    for (const sensor of sensors) {
        await sensor.initialize()
            .then(() => {
                console.log(`${sensor.name()}: initialization succeeded`);
            })
            .catch(err => console.error(`${sensor.name()}: initialization failed: ${err} `));
    }
};

const read = async (sensors) => {
    for (const sensor of sensors) {
        await sensor.read()
            .then(record => {
                console.log(`${sensor.name()}: read\n`, record, '\n');
            })
            .catch(err => {
                console.log(`${sensor.name()}: read error ${err}`);
            });
    }
};

initialize(sensors);
setInterval(() => { read(sensors) }, process.env.INTERVAL);
