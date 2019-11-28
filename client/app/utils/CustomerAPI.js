import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getCustomers = () =>
  fetch(`${address}/${api}/customers`, {
    headers,
  })
  .then(res => res.json())

export const getCustomer = name => 
  fetch(`${address}/${api}/customer/find?name=${name}`)
  .then(res => res.json())

export const getCustomerByID = id => 
fetch(`${address}/${api}/customer/findByID?id=${id}`)
.then(res => res.json())

export const getCustomersFromUser = user =>
  fetch(`${address}/${api}/customer/findFromUser?user=${user}`)
  .then(res => res.json())

export const createCustomer = customer =>
  fetch(`${address}/${api}/customer/create`, {
    headers,
    method: 'POST',
    body: customer
  })
  .then(res => res.json())

export const removeCustomer = id =>
  fetch(`${address}/${api}/customer/remove?id=${id}`, {
    headers,
    method: 'DELETE',
  })
  .then(res => res.json())
  

export const updateCustomer = customer => 
  fetch(`${address}/${api}/customer/update`, {
    headers,
    method: 'PUT',
    body: customer
  })
  .then(res => res.json())