import {RESTORE_AUTH_STATE, AUTHENTICATE, DEAUTHENTICATE} from "../actions/AuthActionConstants";


import {getCookie, setCookie, removeCookie} from '~/utils/cookie';


let initialState;
if (typeof localStorage !== "undefined") {
   const authCookie = getCookie('auth');
   if (authCookie) {
       initialState = JSON.parse(decodeURIComponent(authCookie));
   } else {
       initialState = {
           isLoggedIn: false,
           user: {}
       }
   }
} else {
   initialState = {
       isLoggedIn: false,
       user: {}
   };
}


const authReducer = (state = initialState, action) => {
   switch (action.type) {
       case DEAUTHENTICATE:
           removeCookie("auth");
           return {
               isLoggedIn: false
           };


       case AUTHENTICATE:
           const authObj = {
               isLoggedIn: true,
               user: action.payload
           };
           setCookie("auth", authObj);
           return authObj;
       case RESTORE_AUTH_STATE:
           return {
               isLoggedIn: true,
               user: action.payload.user
           };
       default:
           return state;
   }
};

export default authReducer;