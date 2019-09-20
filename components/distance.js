import isPointWithinRadius from 'geolib/es/isPointWithinRadius'

const CurryCircle = radius => (point1, point2) => isPointWithinRadius(point1,point2,radius)
export const inCircle = CurryCircle(5000)

