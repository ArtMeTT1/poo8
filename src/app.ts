import { time } from "console";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import { Location } from "./location";
import { Crypt } from "./crypt"
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import * as crypto from 'crypto'
import { DuplicateUserError } from "./errors/duplicate-user-error";


export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []
    crypt: Crypt = new Crypt()

    findUser(email: string): User {
        return this.users.find(user => user.email === email)
    }
    findRent(bikeId: string): Rent{
        return this.rents.find(rent => rent.bike.id === bikeId)
    }
    findBike(bikeId: string): Bike{
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if(bike == undefined) throw new BikeNotFoundError()
        return this.bikes.find(bike => bike.id === bikeId)
    }

    async registerUser(user: User): Promise<string> {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new DuplicateUserError()
            }
        }
        const newId = crypto.randomUUID()
        user.id = newId
        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        this.users.push(user)
        return newId
    }


    removeUser(email: string): void {
        let index : number
        index = this.users.indexOf(this.findUser(email))
        this.users.splice(index,1)
    }

    registerBike(bike: Bike): void{
        for(const rBike of this.bikes){
            if(rBike.id === bike.id) throw new Error('Duplicate bike')
        }
        bike.id = crypto.randomUUID()
        this.bikes.push(bike)
    }

    rentBike(bikeId: string, userEmail: string): void {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) {
            throw new Error('Bike not found.')
        }
        if (!bike.available) {
            throw new Error('Unavailable bike.')
        }
        const user = this.findUser(userEmail)
        if (!user) {
            throw new Error('User not found.')
        }
        bike.available = false
        const newRent = new Rent(bike, user, new Date())
        this.rents.push(newRent)
    }


    returnBike(bikeId: string, userEmail: string): number {
        const now = new Date()
        const rent = this.rents.find(rent =>
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            !rent.end
        )
        if (!rent) throw new Error('Rent not found.')
        rent.end = now
        rent.bike.available = true
        const hours = diffHours(rent.end, rent.start)
        return hours * rent.bike.rate
    }

    listUsers(): User[] {
        return this.users.slice() 
    }

    listRents():Rent[]{
       return this.rents.slice()
    }
    listBikes():Bike[]{
        return this.bikes.slice()
    }
    async authenticate(userEmail: string, password: string): Promise<boolean> {
        const user = this.findUser(userEmail)
        if (!user) throw new Error('User not found.')
        return await this.crypt.compare(password, user.password)
    }
    moveBikeTo(bikeId: string, location: Location) {
        const bike = this.findBike(bikeId)
        bike.location.latitude = location.latitude
        bike.location.longitude = location.longitude
    }

    
}
function diffHours(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(diff);
  }

