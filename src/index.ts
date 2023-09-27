import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";


const user = new User('Maria', 'maria@mail.com', '1234')
const today = new Date()
const twoDaysFromToday = new Date()
twoDaysFromToday.setDate(twoDaysFromToday.getDate() + 2)
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const sevenDaysFromToday = new Date()
sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + 7)
const user2 = new User('Maria Clara', 'maria@mail.com', '3123')
const app = new App()


app.registerUser(user)


//app.rentBike(bike,user2,today,twoDaysFromToday)
//console.log(app.findRent('567'))
//console.log(app.findUser('maria@mail.com'))
//app.removeUser('maria@mail.com')
//console.log(app.findUser('maria@mail.com'))

