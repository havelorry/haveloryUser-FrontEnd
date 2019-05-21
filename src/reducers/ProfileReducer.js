export const FETCH_PROFILE = '@user[profile fetch]'
initialState = {
    profile:{}
}
export default function(state=initialState,action){
    switch (action.type) {
        case FETCH_PROFILE:
            return {
                ...state,
                profile:action.payload
            }
    
        default:
            return state;
    }
}