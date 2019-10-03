import isPointWithinRadius from 'geolib/es/isPointWithinRadius'
import  { getDistance } from "geolib"
const CurryCircle = radius => (point1, point2) => isPointWithinRadius(point1,point2,radius)

export  const calcDist = (point1,point2) => Math.abs(getDistance(point1,point2))

const  getPrice =  (distance,price) => {
    if (!distance) {
        console.log("No price provided by  api");
        
        return price
    }
    if (distance <= 7000) {
        return  price+10
    }else if (distance  >7000 && distance  <10000) {
        return price+15
    }else  if(distance  >=10000 && distance <30000){
        return  price+30
    }
}

export  const  mapDrivers = (userLoc,list)  =>  list.map((driver)=>{
    const location = {
        latitude:driver.location.x,
        longitude:driver.location.y
    }

    const distance =  calcDist(userLoc,location);
    return {
        ...driver,
        price:getPrice(distance,driver.price),
        workers:0
    }
})
export const inCircle = CurryCircle(5000)

