# Inventory Application

A backend focused inventory management app that allows users to add newproduct categories, create new products to add to the database.
You will be able to create, read, update, or delete Categories, and products from the database.

[Live Page.](https://fathomless-wildwood-81892.herokuapp.com/)

## Built with

- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com)
- [Express Validator](https://express-validator.github.io)
- [EJS](https://www.npmjs.com/package/ejs)

## Admin Password

An administrator password has been added to act as an extremely basic security feature.  
the pass is `123456`

## Running your own version

```
git clone https://github.com/Soul-Remix/inventory-application.git
cd inventory-application
npm install
npm start
```

Create A mongo DB, create .env file and add the following

```
MONGODB_URI=<Mongo database URL>
PASS=<Random string for the password>
```

Run locally  
`npm start`
