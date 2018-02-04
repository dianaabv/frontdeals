import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import 'moment/locale/ru.js';
import swal from 'sweetalert'
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import socketIOClient from "socket.io-client";




class MyKontragents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            users: [],
            allusers: [],
            endpoint: "http://185.100.67.106:4040",
            roomname: ''
        },
        this.example = this.example.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.addtofriend = this.addtofriend.bind(this)

    }
    addtofriend(event){
      axios.get('http://185.100.67.106:4040/api/addtofriend?friend_id='+event.target.name,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
        if(res.data.message.length != 0){
          this.setState({ message: res.data.message, roomname: res.data.roomname});
          const socket = socketIOClient(this.state.endpoint);
          socket.emit('join room', this.state.roomname)

          swal({text: this.state.message}).then(function(){window.location.reload()})   
        }
      })
      .catch(err => {
        if (err.response) {
          const errors = err.response ? err.response : {};
          errors.summary = err.response.data.message;
          this.setState({
            errors
          });
        }
      });

    }

    


    componentDidMount() {
      axios.get('http://185.100.67.106:4040/api/searchmykontragents',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           allusers: res.data.allusers
          });
      })
      .catch(err => {
        if (err.response) {
          const errors = err.response ? err.response : {};
          errors.summary = err.response.data.message;
          this.setState({
            errors
          });
        }
      });
    }
    example(){
        console.log('example')
    }


    handleSearch(event){
      var searchQuery = event.target.value.toLowerCase();
      if(searchQuery){
        var users = this.state.allusers.filter(function(el){
          var searchValue = el.firstname.toLowerCase()  + ' '+ el.lastname.toLowerCase()  + ' '+ el.udv
          //console.log(searchValue)
          return searchValue.indexOf(searchQuery)!== -1;
        });
        this.setState({
          users: users
        });
      }
       else {
        this.setState({
          users: []
        });
      }
    }
    render() {
      console.log(this.state.allusers)
      //console.log(this.state.users, 'users')
      const socket = socketIOClient(this.state.endpoint);
    
      // socket.on('addtofriend', (push) => { 
      //   console.log(push)
      //   console.log('vas dobavili v druzya')
      // })
        return (

                <div className="page">
                    <div className="page-content container-fluid">
                        <div className="panel">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="panel-title-icon icon fa fa-users" aria-hidden="true" />Мои контрагенты</h3>
                            </div>
                        </div>
                        <div className="row">
                   
                            <div className="col-md-6">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-user-plus" aria-hidden="true" />Добавить контакты</h3>
                                    </div>
                                    <div className="panel-body container-fluid">
                                       
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Поиск может быть совершен по № Удостоверения личности, Фамилии, Имени, либо уникальному id</label>
                                                    <div className="input-search">
                                                        <i className="input-search-icon wb-search" aria-hidden="true" />
                                                        <input onChange={this.handleSearch} type="text" className="form-control" name="site-search" placeholder="Поиск по ключевым словам..." />
                                                        <button type="button" className="input-search-close icon wb-close" data-target="#site-navbar-search" data-toggle="collapse" aria-label="Close" />
                                                    </div>
                                                </div>
                                                       {this.state.users.length!=0 ? (  <div className="row">{this.state.allusers.map((request, s) => 
                                                                                       <div key={s} className="col-md-12 myborder">
                                                                                           <div className="form-group">
                                                                                               <h4>ФИО</h4>
                                                                                               <label className="form-control-label">{request.lastname} {request.firstname} {request.midname}</label>
                                                                                           </div>
                                                                                           <div className="form-group">
                                                                                               <h4>Сотовый</h4>
                                                                                               <label className="form-control-label">{request.username} </label>
                                                                                           </div>
                                                                                           <div className="form-group">
                                                                                                <button name={request._id} onClick={this.addtofriend} className="btn">Добавить</button>
                                                                                           </div>
                                                                                       </div>
                                                                                   )}</div>) : (  
                                                                                                   <div className="">
                                                                                                           <div className="form-group">
                                                                                                               <h4>Поиск ...</h4>
                                                                                                           </div>
                                                                                                   </div>
                                                                                                 )} 

                                            {/*    { this.state.users.map((user, s) =>
                                                                                              <div className="form-group">
                                                                                              <h4>ФИО: {user.firstname} {user.lastname}</h4>
                                                                                              <h4>Сотовый: {user.username} </h4>
                                                                                              <h4>Email: {user.email} </h4>
                                                                                              <button name={user._id} onClick={this.addtofriend} className="btn">Добавить</button>
                                                                                              </div>
                                                                                              )}*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            

                        </div>
                    </div>
                </div>   
                              
                            

        );
    }
}

export default MyKontragents;
