export const SET_ORIGIN = 'map[origin set]'
export const SET_DEST = 'map[destination set]'
export const SET_CURRENT_LOCATION = 'map[current]'
export const SET_MARKERS = 'map marker [set]'
 
const initialState = {
    origin:{
        text:"",
        coords:{
            lat:0,
            lng:0
        },
        set:false
    },
    destination:{
        text:"",
        coords:{
            lat:0,
            lng:0
        },
        set:false
    },

    current:{},
    markers:[]

}

export default function(state=initialState,action){
    switch (action.type) {
        case SET_ORIGIN:
            return {
                ...state,
                origin:action.payload
            }
    
        case SET_ORIGIN:
            return {
                ...state,
                destination:action.payload
            }

        case SET_CURRENT_LOCATION:
            return {
                ...state,
                current:action.payload
            }

        case SET_MARKERS:
            return {
                ...state,
                markers:action.payload
            }

        default:
            return state
    }
}
