'use strict'

const faker = require('faker')
const dateformat = require('dateformat')

const example = []
for (let i = 1; i < 5 ; i++) {
  example.push({
    'name': `node${i}@127.0.0.1`,
    'process_used': faker.random.number({min:100, max:200}),
    'process_available': faker.random.number({min:600, max:700}),
    'load1': faker.random.number({min:1, max:10}),
    'load5': faker.random.number({min:1, max:10}),
    'memory_used': `${faker.random.number({min:10, max:50})}M`,
    'memory_total': '200M',
    'max_fds': '1024',
    'clients': faker.random.number({min:7000, max:10000}),
    'node_status': faker.random.arrayElement(['Running', 'Stoped'])
  })
}

module.exports = {
  example,
}
