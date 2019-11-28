# Product Database Quote Engine V1.0.0

## Summary

The product database quote engine is a clear and powerfull app that allows product managers of various producers of any type of products to store their product information in a database system. With that information a 'quote engine' can use the data to create quotes for a customer, that requests it. On the spot.

## How it works

### Log in:

There are 3 types of accounts:
* __Admin__: has total control over data input + customer and vendor data input + account management, and can also access the quote engine
* __Editor__: can only create items in the item database + collection database
* __SalesRep__: has only access to the quote engine + customers

### Database input

The Admin and Editor accounts can input the products with all the necessary properties.

They can also input collections that items can be a part of.

The Admin and Salesrep accounts have access to the customer database, where they can put in their customer, which gets saved under their account.

The Admin account also has access to the Vendor database, and User database where it can manage the other users of the app.

### Quote Engine

The quote engine is a 5-step process:

1. Search for items (which get fetched from the item database) that you want to add to the quote. Select desired items and click the 'Add' button.
2. Manage your list of added items with the convenient side panel, which keeps track of the items added.
3. Once happy with the list, click the 'Quote' button, after which a panel appears where you can search for the desired customer to send the quote to. If the right customer is not in the list, you can create it by clicking the 'new' button.
4. A new page appears with all information together. Here you can make the last amends to the list and customer information.
5. Once happy, click the 'Quote' button, and after confirming, an email with the quote will be sent to the customer!

## Navigation

* _Home page_
  * Admin & Salesrep: link to create a new quote, or view saved quotes
  * Editor: link to create a new item or edit existing item
* _New Quotes_: Create your new quote here
* _Saved Quotes_: Scroll through old quotes and select to edit them or remove them
* _My Customers_: Manage your customers here
* _Manage Users_: Admin can manage the users of the app here
* _Manage Vendor Database_: Admin can manage the vendors in the app here
* _Manage Item Database_: Manage items here
* _Manage Collection Database_: Manage collections here
* _My Info_: Review your info here
* _Log Out_: Log out of the account

## Coding language

This app is created using the MERN stack:
* MongoDB
* Express.js
* React.js
* Node.js

This app also uses the [Amazon web service](https://aws.amazon.com/) for picture storage

## Licence

This application is created by Matthijs Kralt (c) 2019