// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import Auth from '../modules/Auth'
import jwtDecode from 'jwt-decode';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import socketIOClient from "socket.io-client";

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      endpoint: "http://localhost:4001",
      kontragents: [],
      duedate: '',
      deadline: '',
      goreceiver: '',
      lawid: '506',
      role: '',
      deal506:{
        presenter:'',
        receiver: '',
        itemname: '',
        quantity: '',
        additional: ''
      },
      message: '',
      checkContent: false
    }
    this.deal506=this.deal506.bind(this)
    this.updateDeal506=this.updateDeal506.bind(this)
    this.updateRole=this.updateRole.bind(this)
    this.send=this.send.bind(this);

  }
  componentDidMount() {
      axios.get('http://localhost:4001/api/getmykontragents',{
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
  checkContent(){
//console.log(this.state.deal506.presenter.length,'p',this.state.deal506.receiver.length,'r',this.state.deal506.itemname,'i',this.state.deal506.quantity.length,'q',this.state.deal506.additional.length,'a',String(this.state.duedate).length,'du',String(this.state.deadline).length,'ded')
    if((this.state.deal506.presenter.length>0)&&(this.state.deal506.receiver.length>0)&&(this.state.deal506.itemname.length>0)&& (this.state.deal506.quantity.length>0)&&(String(this.state.duedate).length>0) && (String(this.state.deadline).length>0)){
      this.setState({
        checkContent: true
      })
    }else {
          this.setState({
            checkContent: false
          })
        }
  }
  deal506(event){
    const field = event.target.name;
    const deal506 = this.state.deal506;
    deal506[field] = event.target.value;
    // console.log(this.state.deal506)
    this.checkContent();
  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Даритель'){
    this.state.deal506['presenter']=decoded.sub
    this.state.deal506['receiver']=''
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Одаряемый'){
      this.state.deal506['receiver']=decoded.sub
      this.state.deal506['presenter']=''
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal506['receiver']=''
      this.state.deal506['presenter']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  updateDeal506(event){
      const formData = `deal506=${JSON.stringify(this.state.deal506)}&duedate=${this.state.duedate}&deadline=${this.state.deadline}&lawid=${this.state.lawid}`;
      axios.post('http://localhost:4001/api/createdeal506',formData,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           message: res.data.message
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
  send = () => {
    var deal506=JSON.stringify(this.state.deal506)
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('createdeal506', {deal506 : deal506, duedate: this.state.duedate, deadline: this.state.deadline}) // change 'red' to this.state.color
  }

  render() {
  const today=new Date();
  today.setDate(today.getDate() + 1)   
    return (

    <div className="col-md-6">
      <div className="form-group">
        <h3>Договор дарения</h3>
      </div>
  
   
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="Даритель">Даритель</option>
        <option value="Одаряемый">Одаряемый</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
            <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Одаряемый </label> <br/ >
         {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="receiver"  onChange={this.deal506}>
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
        ) : (this.state.goreceiver=='neok')? (
                   <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Даритель </label> <br/ >
         {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="presenter"  onChange={this.deal506}>
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
        ) :(this.state.goreceiver=='')?(<p>Выберите роль</p>):(
<p></p>
        )}
  
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Наименование дара (вещи или имущественного права (требование) либо освобождения от имущественной обязанности)</label>
        <input onChange={this.deal506}  type="text" className="form-control" id="inputNameAddShop" name="itemname" placeholder="Имя" autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Количество дара</label>
        <input onChange={this.deal506}  type="text" className="form-control" id="inputNameAddShop" name="quantity" placeholder="Имя" autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Сроки и порядок передачи дара(момент перехода права собственности)</label>
            <DatePickerInput    minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({deadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок действия договора</label>
            <DatePickerInput    minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Дополнительные условия</label>
        <input onChange={this.deal506}  type="text" className="form-control" id="inputNameAddShop" name="additional"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.send} className="btn btn-primary btn-block btn-round">Socket</button>
        <button  disabled={!this.state.checkContent} type="button" onClick={this.updateDeal506} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;