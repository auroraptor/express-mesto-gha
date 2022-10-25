/* eslint-disable no-useless-escape */
const baerer = /Baerer /;
const cookieJwt = /jwt=/;
const url = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
const password = /^[a-zA-Z0-9_]{3,30}$/;
const id = /[a-f0-9]/;

module.exports = {
  baerer, cookieJwt, url, password, id,
};
