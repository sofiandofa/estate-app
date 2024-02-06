import {createSlice} from  "@reduxjs/toolkit"

const initialState={
    email:null,
    username:null,
    password:null,
    otp:null,
    error:null,
    loading:false,
}

const signUpSlice=createSlice({
    name:'signUp',
    initialState,
    reducers:{
        signUp:(state,action)=>{
            const{email,username,password} =action.payload
            state.email=email
            state.username=username
            state.password=password
            
        },
        signOut:(state)=>{
            state.email=null
            state.username=null
            state.password=null
        }
    }


})

export const  {signUp,signOut}=signUpSlice.actions
export default signUpSlice.reducer