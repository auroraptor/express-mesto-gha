/* eslint-disable no-console */
const log = (...args) => console.log(...args);
const error = (err) => console.error(err);

const logNow = (...args) => log(new Date(), ...args);

module.exports = { log, logNow, error };
