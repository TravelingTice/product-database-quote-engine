import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const sendMail = (customer, items) => 
  fetch(`${address}/${api}/email/send`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      customer,
      items
    })
  })
  .then(res => res.json())

export const sendSignUpEmail = user =>
  fetch(`${address}/${api}/email/sendSignUpEmail`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({user})
  }).then(res => res.json())