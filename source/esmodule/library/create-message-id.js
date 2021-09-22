import { Is } from '@virtualpatterns/mablung-is'
import Cryptography from 'crypto'

export function CreateMessageId(length = 16) {

  return new Promise((resolve, reject) => {

    Cryptography.randomBytes(parseInt(Math.ceil(length / 2.0)), (error, buffer) => {
      if (Is.null(error)) {
        resolve(buffer.toString('hex'))
      } else {
        reject(error)
      }
    })

  })

}