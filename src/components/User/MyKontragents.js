import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import 'moment/locale/ru.js';
import swal from 'sweetalert'
import { DatePicker, DatePickerInput } from 'rc-datepicker';





class MyKontragents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            kontragents: [],
            users: []
        },
        this.handleSearch=this.handleSearch.bind(this)

    }

    


    componentDidMount() {
        axios.get('http://185.100.67.106:4040/api/getmykontragents',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
            users: res.data.kontragents,
           kontragents: res.data.kontragents
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
    handleSearch(event){
      var searchQuery = event.target.value.toLowerCase();
      if(searchQuery){
        var users = this.state.kontragents.filter(function(el){
          var searchValue = el.myfriend.firstname.toLowerCase()  + ' '+ el.myfriend.lastname.toLowerCase()  + ' '+ el.myfriend.udv
          //console.log(searchValue)
          return searchValue.indexOf(searchQuery)!== -1;
        });
        this.setState({
          users: users
        });
      }
       else {
        this.setState({
          users: this.state.kontragents
        });
      }
    }
    
    render() {
        console.log(this.state.users)
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
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-handshake-o" aria-hidden="true" />Мои контакты</h3>
                                    </div>
                                    <div className="panel-body container-fluid">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="input-search">
                                                        <i className="input-search-icon wb-search" aria-hidden="true" />
                                                        <input onChange={this.handleSearch} type="text" className="form-control" name="site-search" placeholder="Search..." />
                                                        <button type="button" className="input-search-close icon wb-close" data-target="#site-navbar-search" data-toggle="collapse" aria-label="Close" />
                                                    </div>
                                                </div>
                                                {this.state.kontragents.length==0 ? (        <div className="">
                                                                                                   <div className="form-group">
                                                                                                       <h4>У вас нет контрагентов</h4>
                                                                                                       
                                                                                                   </div>
                                                                                           </div>) : (<div></div>)}
                                           {this.state.users.length!=0 ? ( 
                                        <div className="row">{this.state.users.map((request, s) => 
                                            <div key={s} className="col-md-12 myborder">
                                                <div className="form-group">
                                                    <h4>ФИО</h4>
                                                    <label className="form-control-label">{request.myfriend.lastname} {request.myfriend.firstname} {request.myfriend.midname}</label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Сотовый</h4>
                                                    <label className="form-control-label">{request.myfriend.username} </label>
                                                </div>
                                            </div>
                                        )}</div>
                                        ) : (  
                                                                                           <div className="">
                                                                                                   <div className="form-group">
                                                                                                       <h4>Ничего не найдено</h4>
                                                                                                       
                                                                                                   </div>
                                                                                           </div>
                                                                                         )} 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                           </div>
                            <div className="col-md-6">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-user-plus" aria-hidden="true" />Добавить контакты</h3>
                                    </div>
                                    <div className="panel-body container-fluid">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <h4>Cотовый</h4>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">+7</span>
                                                    </div>
                                                    
                                                </div>
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
