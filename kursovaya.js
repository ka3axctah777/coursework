'use strict';
const camelcase = require('camelcase');

const keyWord = 'find';

const assertion = {
  WhereIs: (object, value) => object === value,
  Empty: (object) => object.length === 0,
};

const assertNames = Object.keys(assertion);

const wrap = arr => new Proxy(arr, {
  get(target, propKey) {
    if (propKey in target) return target[propKey];
    const assertName = assertNames.find(assert =>
      propKey.endsWith(assert));
    if (propKey.startsWith(keyWord)) {
      const field = camelcase(
        propKey.substring(keyWord.length,
          propKey.length - assertName.length)
      );
      const assert = assertion[assertName];
      return value => target.find(item => assert(item[field], value));
    }
  }
});

const arr = wrap([
  { car: 'Dacia', model: '1300', year: 1969 },
  { car: 'Ferrari', model: '488GTB', year: 2016 },
  { car: 'BMW', model: 'X5', year: 1999 },
  {}
]);

console.log(arr.findCarWhereIs('BMW'));
console.log(arr.findEmpty);

const handler = {
  set(obj, prop, value) {
    if (typeof value !== 'string') {
      throw new Error('only string is allowed');
    } else {
      obj[prop] = value;
    }
  return value;
  }
};

const obj = {};
const proxyObj = new Proxy(obj, handler);

console.log(proxyObj);

proxyObj.name = 'abcd';

console.log(proxyObj);


