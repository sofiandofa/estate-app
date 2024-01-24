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
            state.currentUser=null

        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false
            state.error=null
        },
        updateUserStart:(state )=>{
            state.loading=true

        },
        updateUserFailure:(state ,action)=>{
            state.loading=false
            state.error=action.payload
            state.currentUser=null
        },
        updateUserSuccess:(state ,action)=>{
            state.loading=false
            state.error=null
            state.currentUser=action.payload
        },
        deleteUserStart:(state )=>{
            state.loading=true

        },
        deleteUserFailure:(state ,action)=>{
            state.loading=false
            state.error=action.payload
            state.currentUser=null
        },
        deleteUserSuccess:(state )=>{
            state.loading=false
            state.error=null
            state.currentUser=null
        },
        signOutUserStart:(state )=>{
            state.loading=true

        },
        signOutUserFailure:(state ,action)=>{
            state.loading=false
            state.error=action.payload
            state.currentUser=null
        },
        signOutUserSuccess:(state )=>{
            state.loading=false
            state.error=null
            state.currentUser=null
        },
    }
})


export  const {
    signInFailure,signInStart,signInSuccess,
    updateUserFailure,updateUserSuccess,updateUserStart,
    deleteUserStart,deleteUserFailure,deleteUserSuccess,
    signOutUserFailure,signOutUserStart,signOutUserSuccess,
} =userSlice.actions

export default userSlice.reducer