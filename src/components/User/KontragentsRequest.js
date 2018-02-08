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
          endpoint: "http://185.100.67.106:4040",
            message: '',
            in_requests: [],
            out_requests: []
        },
        this.acceptfriendship = this.acceptfriendship.bind(this)
        this.refusefriendship = this.refusefriendship.bind(this)

    }

    


    componentDidMount() {
        axios.get('http://185.100.67.106:4040/api/getmyrequests',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           in_requests: res.data.in_requests,
           out_requests: res.data.out_requests
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
    acceptfriendship(event){
      axios.get('http://185.100.67.106:4040/api/acceptfriendship?friend_id='+event.target.name,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
            message: res.data.message,
            roomname: res.data.roomname
          });
          const socket = socketIOClient(this.state.endpoint);
          socket.emit('join room', this.state.roomname)
          swal({text: this.state.message}).then(function(){window.location.reload()}) 
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
    refusefriendship(event){
      axios.get('http://185.100.67.106:4040/api/refusefriendship?friend_id='+event.target.name,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
            message: res.data.message
          });
          swal({text: this.state.message}).then(function(){window.location.reload()}) 
      })
      .catch(err => {
        if (err.response) {
          const errors = err.response ? err.response : {};
          errors.summary = err.response.data.message;
          this.setState({
            errors
          });
        }
      })
    }
    render() {
        return (

                <div className="page">
                    <div className="page-content container-fluid">
                        <div className="panel title_border">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="panel-title-icon icon fa fa-users" aria-hidden="true" />Мои заявки</h3>
                            </div>
                        </div>
                        <div className="row">
                           <div className="col-md-6">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-arrow-down" aria-hidden="true" />Входящие заявки</h3>
                                    </div>
                                    <div className="panel-body container-fluid">
                                        
            
                                        {this.state.in_requests.length!=0 ? (  <div className="row">{this.state.in_requests.map((request, s) => 
                                            <div key={s} className="col-md-12 myborder">
                                                <div className="form-group">
                                                    <h4>ФИО</h4>
                                                    <label className="form-control-label">{request.myfriend.lastname} {request.myfriend.firstname} {request.myfriend.midname}</label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Сотовый</h4>
                                                    <label className="form-control-label">{request.myfriend.username} </label>
                                                </div>
                                                <div className="form-group">
                                                    <button  name={request.myfriend._id} type="button" onClick = {this.acceptfriendship} className="btn btn-primary btn-block">Принять</button>
                                                </div>
                                                <div className="form-group">
                                                    <button  name={request.myfriend._id} type="button" onClick = {this.refusefriendship} className="btn btn-block">Отклонить</button>
                                                </div>
                                            </div>
                                        )}</div>) : (  
                                                        <div className="">
                                                                <div className="form-group">
                                                                    <h4>У вас нет входящих заявок</h4>
                                                                    
                                                                </div>
                                                        </div>
                                                      )}
                                      
                                         
                                        
                                    </div>
                                </div>
                                
                           </div>
                           <div className="col-md-6">
                                                 <div className="panel ">
                                                     <div className="panel-heading">
                                                         <h3 className="panel-title"><i className="panel-title-icon icon fa fa-arrow-up" aria-hidden="true" />Исходящие заявки</h3>
                                                     </div>
                                                     <div className="panel-body container-fluid">
                                                         
                                                           {this.state.out_requests.length!=0 ? (  <div>{this.state.out_requests.map((request, s) => 
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
                                        )}</div>) : (
                                                           
                                                        <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <h4> У вас нет исходящих заявок</h4>
                                                                    
                                                                </div>
                                                        </div>
                                                      )}
                                                           
                                                        
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
