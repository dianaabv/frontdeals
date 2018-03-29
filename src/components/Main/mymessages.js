// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js'
import Auth from '../modules/Auth';
import swal from 'sweetalert';
import jwtDecode from 'jwt-decode';

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lawid: '688',
      kontragents: [],
      shippingday: '',
      shippingday_err: '',
      duedate: '',
      messages: [],
      duedate_err: '',
      deal688: {
        to: '',
        from: '',
        additional: ''
      },
      status1: '',
      status: 'Физическое лицо',
      valid_err: []
    }
    this.deal688=this.deal688.bind(this)
  }
    componentWillMount(){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    console.log(decoded.sub)
    axios.get('http://185.100.67.106:4040/api/gettest',{
    responseType: 'json',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': `bearer ${Auth.getToken()}`
    }
    }).then(res => {
        this.setState({
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
    this.setState({
      status1: decoded.userstatus
    });
  }
  handleOptionChangeFiz(event){
    //console.log(event.target.value)
    this.setState({
      status: event.target.value
    });
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
  deal688(event){
    const field = event.target.name;
    const deal688 = this.state.deal688;
    deal688[field] = event.target.value;

  }
getMy(){
  axios.get('http://185.100.67.106:4040/api/getmymessages',{
  responseType: 'json',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    'Authorization': `bearer ${Auth.getToken()}`
  }
  }).then(res => {
      this.setState({
       messages: res.data.messages
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
updateDeal(){
  const formData = `deal688=${JSON.stringify(this.state.deal688)}`;

  axios.post('http://185.100.67.106:4040/api/test',formData,{
  responseType: 'json',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    'Authorization': `bearer ${Auth.getToken()}`
  }
  }).then(res => {
      this.setState({
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
  render() {
      const today=new Date();
    today.setDate(today.getDate() + 1)
    return (








  <div className="page">
      <div className="page-content container-fluid">
          <div className="panel">
              <div className="panel-heading">
                  <h3 className="panel-title"><i className="panel-title-icon icon fa-gears" aria-hidden="true" />Напишите сообщение</h3>
              </div>
              <div className="panel-body container-fluid">
                  <div className="row">
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Encrypted message</label>
                        </div>
                    </div>

                    </div>
              </div>
          </div>
<div className="col-lg-12 col-md-10 panel panel-info panel-line" style={{margin: 'auto'}}>

              <div className="panel-heading">
                  <h3 className="panel-title">Напишите зашифрованое сообщение </h3>
              </div>
              <div className="panel-body">
                      <div className="row">

                          <div className="col-md-6">
                             <div className="form-group">
                              <h3>Чат</h3>
                              </div>
                              <div className="form-group">
                                <label className="form-control-label" htmlFor="citySelectorAddShopForm">Отправитель</label>
                                                   {
                                                                            this.state.kontragents.length!=0 ?
                                                                            (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("sender")  ? 'input_err' : '')}  name="to" onChange={this.deal688}>
                                                                            <option value=''>Выберите контрагента</option>
                                                                            {this.state.kontragents.map((user, s) =>
                                                                              <option key={s} value={user.myfriend._id}>{user.myfriend.firstname} {user.myfriend.lastname}</option>
                                                                            )}
                                                                            </select>) :
                                                                            ( <select id="citySelectorAddShopForm" className="form-control">
                                                                            <option value=''>У вас пока нет контрагентов</option>
                                                                            </select>
                                                                            )
                                                                          }
                              </div>
                              <div className="form-group">
                                <label className="form-control-label"  >Дополнительные условия (не обязательное ус-ие)                            </label>
                                <input onChange={this.deal688}  type="text" className="form-control"   name="additional"  autoComplete="off" />
                              </div>
                              <div className="form-group">
                                <label className="form-control-label"><br/></label>
                                <button   type="button" onClick={this.updateDeal.bind(this)} className="btn btn-primary btn-block btn-round">Отправить сообщение</button>
                              </div>
                          </div>
                          <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-control-label"><br/></label>
                            <button   type="button" onClick={this.getMy.bind(this)} className="btn btn-primary btn-block btn-round">Get my encrypted messages</button>
                          </div>

                          </div>


                  </div>
              </div>
          </div>
      </div>
  </div>

                   );
  }
}export default Deals;
