import React, {Component} from 'react';
import Login from '~/components/login';
import {connect} from 'react-redux'
import {Router} from '../routes'
import {login} from "~/state/actions/AuthActionCreators";


class LoginPage extends Component {
   constructor(props) {
       super(props);
   }


   componentDidUpdate(prevProps, prevState, snapshot) {
       if(this.props.isLoggedIn === true){
        //    Router.pushRoute('/');
       }
   }


   handleLoginSubmit = (value) => {
       const {dispatch} = this.props;
       dispatch(login(value));
   };


   render() {
       return (
           <div>
               <Login onChange={this.handleLoginSubmit}/>
           </div>
       )
   }
}


function mapStateToProps(state) {
   return {
       user: state.auth.user,
       isLoggedIn: state.auth.isLoggedIn
   };
}


export default connect(mapStateToProps)(LoginPage);