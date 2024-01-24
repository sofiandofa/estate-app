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
        updateUserStart:(state ,action)=>{
            state.loading=true,

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
        }

    }
})


export  const {signInFailure,signInStart,signInSuccess,updateUserFailure,updateUserSuccess,updateUserStart} =userSlice.actions

export default userSlice.reducer