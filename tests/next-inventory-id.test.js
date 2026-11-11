'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const serverSource = fs.readFileSync(path.join(__dirname, '..', 'Server.js'), 'utf8');
const helperSource = serverSource.match(
  /function nextInventoryIdFromValues_\(values, defaultPrefix\) \{[\s\S]*?\n\}/,
);

assert.ok(helperSource, 'Server.js must define nextInventoryIdFromValues_(values, defaultPrefix)');

const context = {};
vm.createContext(context);
vm.runInContext(`${helperSource[0]}; this.nextInventoryIdFromValues_ = nextInventoryIdFromValues_;`, context);
const nextId = context.nextInventoryIdFromValues_;

test('increments the latest numeric inventory ID', () => {
  assert.equal(nextId([['INV-TOR70-1651']], 'INV-TOR70-'), 'INV-TOR70-1652');
});

test('ignores legacy UUID IDs when choosing the sequence', () => {
  assert.equal(
    nextId(
      [['INV-TOR70-1650'], ['INV-ABCDEF12'], ['INV-TOR70-1651'], ['INV-1234ABCD']],
      'INV-TOR70-',
    ),
    'INV-TOR70-1652',
  );
});

test('expands the numeric width after 9999', () => {
  assert.equal(nextId([['INV-TOR70-9999']], 'INV-TOR70-'), 'INV-TOR70-10000');
});

test('starts an empty inventory at the configured prefix and 0001', () => {
  assert.equal(nextId([], 'INV-TOR70-'), 'INV-TOR70-0001');
});
