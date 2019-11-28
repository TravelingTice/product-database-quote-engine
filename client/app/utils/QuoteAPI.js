import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getQuotes = user =>
  fetch(`${address}/${api}/quote/getQuotes?user=${user}`, {
    headers
  })
  .then(res => res.json())

export const getQuote = quoteID =>
  fetch(`${address}/${api}/quote/getQuote?id=${quoteID}`, {
    headers
  })
  .then(res => res.json())

export const createQuote = quote => 
  fetch(`${address}/${api}/quote/createQuote`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(quote)
  })
  .then(res => res.json())

export const updateQuote = (items, id) => 
  fetch(`${address}/${api}/quote/updateQuote`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items,
      id
    })
  })
  .then(res => res.json())

export const removeQuote = id => 
  fetch(`${address}/${api}/quote/remove?id=${id}`, {
    headers,
    method: 'DELETE'
  })
  .then(res => res.json())

export const removeFromQuote = (items, id) =>
  fetch(`${address}/${api}/quote/removeFromQuote`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({
      itemsToBeDeleted: items,
      id
    })
  })
  .then(res => res.json())