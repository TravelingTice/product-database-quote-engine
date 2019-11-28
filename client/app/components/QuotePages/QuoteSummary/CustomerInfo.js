import React from 'react';

const CustomerInfo = props => (
  <div className="top">
    <div className="business-card-container">
      <img src={props.customer.businessCard} alt={props.customer.name}/>
    </div>
    <div className="customer-info-container">
      <p className="customer-name">{props.customer.name}</p>
      <p className="customer-company">{props.customer.company}</p>
      <p className="customer-email">{props.customer.email}</p>
      <button 
      className="customer-edit-btn btn btn-danger"
      onClick={e => props.onEditCustomer(e)}>
        Edit company info
      </button>
    </div>
  </div>
);

export default CustomerInfo;