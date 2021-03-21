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

export const fetchData = (fileName: string, groupBy?: string): Promise<Map<string, any>> => {
  return new Promise((resolve, reject) => {
    csv(`/data/${fileName}`, (err, data) => {
      if (err) {
        reject(err)
      } else {
        if (groupBy) {
          const result = group(data, (d) => d.code) as Map<string, any>
          resolve(result)
        } else {
          const result = new Map()
          for (const d of data) {
            result.set(d.code, parseInt(d.monumente?.toString() || '0'))
          }

          resolve(result)
        }
      }
    })
  })
}
