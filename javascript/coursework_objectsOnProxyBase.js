'use strict';
const camelcase = require('camelcase');

const keyWord = 'find';

const assertion = {
  WhereIs: (object, value) => object === value,
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
  { car: 'Peshkom', model: 'kpi', year: 2018 },
]);

console.log(arr.findCarWhereIs('BMW'));

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

function changeFields(data) {
  let tempObj = {};
  function commit() {
    Object.assign(data, tempObj);
    tempObj = {};
  }
  return new Proxy(data, {
    get(target, key) {
      if (key === 'commit') {
        return commit;
      }
      if (tempObj.hasOwnProperty(key)) {
        return tempObj[key];
      }
      return target[key];
    },
    set(target, key, val) {
      if (target[key] === val) {
        delete tempObj[key];
      } else {
        tempObj[key] = val;
      }
      return true;
    }
  });
}
const data = { field1: 'abcd', field2: 101 };

console.log('Do perenosa');
console.log(data.field1);
console.log(data.field2);

const perenos = changeFields(data);

perenos.field1 = 'ghgh';
perenos.field2 = 456;
perenos.commit();

console.log('Posle');
console.log(data.field1);
console.log(data.field2);