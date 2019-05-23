export const SET_ORIGIN = 'map[origin set]'
export const SET_DEST = 'map[destination set]'
export const SET_CURRENT_LOCATION = 'map[current]'
export const SET_MARKERS = 'map marker [set]'
export const RESET = 'map[reset]' 
export const SET_SUGGESSTIONS = 'map [suggesstions]'
export const RESET_SUGGESSTIONS = 'map [reset suggessions]'


const initialState = {
    origin:{
        text:"",
        coords:{
            latitude:0,
            longitude:0
        },
        set:false
    },
    destination:{
        text:"",
        coords:{
            latitude:0,
            longitude:0
        },
        set:false
    },

    current:{},
    markers:[],
    suggessions:[]

}

export default function(state=initialState,action){
    switch (action.type) {
        case SET_ORIGIN:
            return {
                ...state,
                origin:action.payload
            }
    
        case SET_DEST:
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

        case RESET:
            return {
                ...state,
                origin:{
                    ...state.origin,
                    set:false
                },
                destination:{
                    ...state.origin,
                    set:false
                }
            }

        case SET_SUGGESSTIONS:
            return {
                ...state,
                suggessions:action.payload
            }

        case RESET_SUGGESSTIONS:{
            return {
                ...state,
                suggessions:[]
            }
        }

        default:
            return state
    }
}
