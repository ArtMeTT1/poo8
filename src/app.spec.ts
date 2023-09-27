import { App } from "./app"
import { Bike } from "./bike"
import { User } from "./user"
import { Location } from "./location"
import * as sinon from 'sinon';
import { DuplicateUserError } from "./errors/duplicate-user-error";
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { RentNotFoundError } from "./errors/rent-not-found";

describe('App', () => {
    it('should correctly calculate the rent amount', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)
        app.moveBikeTo(bike.id, newYork)
        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw an exception when trying to move an unregistered bike', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        const newYork = new Location(40.753056, -73.983056)
        expect(() => {
            app.moveBikeTo(bike.id,newYork)
        }).toThrow(BikeNotFoundError)
    })
    it('should correctly handle a bike rent', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        app.rentBike(bike.id, user.email)
        expect(app.rents.length).toEqual(1)
        expect(app.rents[0].bike.id).toEqual(bike.id)
        expect(app.rents[0].user.email).toEqual(user.email)
        expect(bike.available).toBeFalsy()
    })
    it('should correctly handle a user being registered', async () =>{
        const app = new App()
        const user1 = new User('Yuri', 'amor@gmail.com', '123')
        const newId = await app.registerUser(user1)
        const user0 = new User('luis', 'amor@gmail.com', '321')
        expect(() => {app.registerUser(user0)}).toThrow(DuplicateUserError)
        expect(app.users.length).toEqual(1)
        expect(app.users[0].email).toEqual(user1.email)
        expect(app.users[0].id).toEqual(newId)
    })
    it('should correctly remove a user', async () =>{
        const app = new App()
        const user = new User('Joãozinho', 'jpmatador@gmail.com', '164924')
        await app.registerUser(user)
        app.removeUser(user.email)
        const user0 = new User('Mariazinha', 'mariagbd@gmail.com', 'jqro')

        expect(app.users.length).toEqual(0)
        expect(() =>{app.removeUser(user0.email)}).toThrow(UserNotFoundError)
    })
    it('should be able to correctly authenticate user', async() =>{
        const app = new App()
        const user = new User('Joãozinho', 'jpmatador@gmail.com', '164924')
        await app.registerUser(user)
        expect(async ()=>{
            await app.authenticate(user.email, user.password)}).toBeTruthy()
        expect(async () =>{
            await app.authenticate(user.email, 'nacslknc')}).toBeFalsy()
    })
    it('should correctly handle a bike return', async ()=>{
        const app = new App()
        const user0 = new User('Joaozinho', 'jpmatador', '164924')
        await app.registerUser(user0)
        const user1 = new User('Mariazinha', 'querida@gmail.com', '1234')
        await app.registerUser(user1)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        app.rentBike(bike.id, user0.email)
        const hour = 1000 * 60 * 60
        clock.tick(3 * hour)
        const rentAmount = app.returnBike(bike.id, user0.email)
        expect(app.returnBike(bike.id, user1.email)).toThrow(RentNotFoundError)
        expect(bike.available).toBeTruthy()
        expect(rentAmount).toEqual(300)
    })
})