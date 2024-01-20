import {createSlice} from  "@reduxjs/toolkit"

const initialState={
    currentUser:null,
    error:null,
    loading:false,
}


const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false

        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false
            state.error=null
        }
    }
})


export  const {signInFailure,signInStart,signInSuccess} =userSlice.actions

export default userSlice.reducer