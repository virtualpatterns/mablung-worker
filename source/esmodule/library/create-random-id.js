import { Is } from '@virtualpatterns/mablung-is'
import Cryptography from 'crypto'

export function CreateRandomId(length = 16) {

  return new Promise((resolve, reject) => {

    Cryptography.randomBytes(parseInt(Math.ceil(length / 2.0)), (error, buffer) => {
      if (Is.nil(error)) {
        resolve(buffer.toString('hex'))
      } else {
        reject(error)
      }
    })

  })

}
