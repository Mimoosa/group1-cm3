const dotenv = require('dotenv')
const colors = require('colors')
// const jobs = require('./data/jobs-short.js')
const products= require('./data/products.js')
const Product = require('./models/ProductModel')
const User = require('./models/userModel')
const connectDB = require('./config/db')

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Product.deleteMany()
    // await User.deleteMany()

    await Product.insertMany(products)
    // await User.insertMany(users)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
