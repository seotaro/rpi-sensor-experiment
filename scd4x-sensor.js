'use strict';

const i2c = require('i2c-bus');

const toBuffer = (command) => {
  return Buffer.from([command >> 8, command & 0xff])
}

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

class SCD4X {
  static ADDRESS = 0x62;

  // コマンド定義
  static START_PERIODIC_MEASUREMENT_COMMAND = 0x21b1;
  static READ_MEASUREMENT_COMMAND = 0xec05;
  static STOP_PERIODIC_MEASUREMENT_COMMAND = 0x3f86;
  static GET_SERIAL_NUMBER_COMMAND = 0x3682;

  static COMMAND_LENGTH = 2;

  constructor() {
    this.bus = null;
  }

  initialize() {
    return i2c.openPromisified(1)
      .then(bus => {
        this.bus = bus;
        return this.stopPeriodicMeasurement();
      })
      .then(() => {
        return sleep(1000);
      })
      .then(() => {
        return this.startPeriodicMeasurement();
      })
  }

  sendCommand(command) {
    return this.bus.i2cWrite(SCD4X.ADDRESS, SCD4X.COMMAND_LENGTH, toBuffer(command));
  }

  read(command, bufferLength) {
    const buf = Buffer.alloc(bufferLength);

    return this.bus.i2cWrite(SCD4X.ADDRESS, SCD4X.COMMAND_LENGTH, toBuffer(command))
      .then(() => {
        return this.bus.i2cRead(SCD4X.ADDRESS, buf.length, buf)
      })
  }

  startPeriodicMeasurement() {
    return this.sendCommand(SCD4X.START_PERIODIC_MEASUREMENT_COMMAND);
  }

  readMeasurement() {
    const toCO2 = (value => value);
    const toTemperature = (value => -45 + 175 * value / 65536)
    const toHumidity = (value => 100 * value / 65536)

    return this.read(SCD4X.READ_MEASUREMENT_COMMAND, 9)
      .then(res => {
        return {
          co2: toCO2(res.buffer.readUInt16BE(0)),
          temperature: toTemperature(res.buffer.readUInt16BE(3)),
          humidity: toHumidity(res.buffer.readUInt16BE(6)),
        }
      })
  }

  stopPeriodicMeasurement() {
    return this.sendCommand(SCD4X.STOP_PERIODIC_MEASUREMENT_COMMAND);
  }
}

module.exports = SCD4X;