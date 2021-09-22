'use strict';

const os = require('os');
const { SHT31 } = require('sht31-node')

const sensor = new SHT31()

exports.name = () => 'SHT31';

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

exports.read = () => {
    return sensor.readSensorData()
        .then(data => {
            const record = {
                datetime: new Date(),
                devices: [
                    {
                        id: `${os.hostname()}-sht31-${Number(sensor.address).toString(16)}`,
                        temperature: data.temperature,
                        humidity: data.humidity
                    }
                ]
            };

            return record;
        });
};
