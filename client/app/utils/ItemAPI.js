import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const createItem = data =>
fetch(`${address}/${api}/item/create`, {
  headers,
    method: 'POST',
    body: data
  })
  .then(res => res.json())
  
export const updateItem = data =>
  fetch(`${address}/${api}/item/update`, {
    method: 'PUT',
    headers,
    body: data
  })
    .then(res => res.json())
    
export const deleteItem = name =>
  fetch(`${address}/${api}/item/delete?name=${name}`, {
    headers
  })
    .then(res => res.json())

export const deleteItemById = id =>
fetch(`${address}/${api}/item/deleteByID?id=${id}`, {
  headers
})
  .then(res => res.json())

export const getItems = options =>
  fetch(`${address}/${api}/items`, {
    headers: {
      ...headers,
      options: options ? JSON.stringify(options) : JSON.stringify({})
    }
  })
    .then(res => res.json())

export const getItem = name =>
  fetch(`${address}/${api}/item?name=${name}`, {
    headers
  })
    .then(res => res.json())

export const getItemByID = id =>
fetch(`${address}/${api}/item/findByID?id=${id}`, {
  headers
})
  .then(res => res.json())

