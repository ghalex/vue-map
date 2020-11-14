import { json, csv } from 'd3-request'
import { group } from 'd3-array'

export const fetchShapes = () => {
  return new Promise((resolve, reject) => {
    json('/data/romania.json', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const fetchData = () => {
  return new Promise((resolve, reject) => {
    csv('/data/data.csv', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(group(data, (d) => d.code))
      }
    })
  })
}
