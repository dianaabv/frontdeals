import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import 'moment/locale/ru.js';
import swal from 'sweetalert'
import { DatePicker, DatePickerInput } from 'rc-datepicker';





class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            status: ''
        }
    }
    componentWillMount(){
        var token = Auth.getToken();
        var decoded = jwtDecode(token);
        this.setState({
          status: decoded.userstatus
        });
    }
    componentDidMount() {
      //   axios.get('http://185.100.67.106:4040/api/getmydashboard',{
      //   responseType: 'json',
      //   headers: {
      //     'Content-type': 'application/x-www-form-urlencoded',
      //     'Authorization': `bearer ${Auth.getToken()}`
      // }
      // }).then(res => {
      //     this.setState({
      //      user: res.data.user
      //     });
      // })
      // .catch(err => {
      //   if (err.response) {
      //     const errors = err.response ? err.response : {};
      //     errors.summary = err.response.data.message;
      //     this.setState({
      //       errors
      //     });
      //   }
      // });
    }

    render() {
        const today=new Date();
        const yesterday = new Date();
        yesterday.setFullYear(yesterday.getFullYear() -18)  
        // console.log(this.state.status)
        return (

                <div className="page">
                    <div className="page-content container-fluid">
                        <div className="panel">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="panel-title-icon icon fa fa-gavel" aria-hidden="true" />Общая информация о моих сделках</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Количество доступных сделок: </h3>
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Количество текущих сделок: </h3>
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Количество завершенных сделок: </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>   
                              
                            

        );
    }
}

export default MyDealsParent;
