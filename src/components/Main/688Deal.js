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
      duedate: '',
      deal688: {
        сarrier: '',
        sender: '',
        transportableproperty: '',
        shippingaddress: '',
        payday: '',
        deliveryaddress: '',
        recipientofproperty: '',
        shippingprice: '',
        additional: ''
      },
      status1: '',
      status: 'Индивидуальный предприниматель'
    }
    this.deal688=this.deal688.bind(this)
  }
    componentWillMount(){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
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
  updateDeal(){
      if((this.state.deal688.сarrier.length>0)&&(this.state.deal688.sender.length>0)&&
          (this.state.deal688.transportableproperty.length>0)&&(this.state.deal688.shippingaddress.length>0)
          &&(this.state.deal688.deliveryaddress.length>0)&&(this.state.deal688.recipientofproperty.length>0)
          &&(this.state.deal688.shippingprice.length>0)
      &&(this.state.deal688.payday.length>0)&&(this.state.duedate>0)&&(this.state.shippingday>0)){
      const formData = `deal688=${JSON.stringify(this.state.deal688)}&duedate=${this.state.duedate}&shippingday=${this.state.shippingday}&lawid=${this.state.lawid}&status=${this.state.status}`;
      axios.post('http://185.100.67.106:4040/create/createdeal688',formData,{
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
      });
    } else {
      swal("Проверьте поля")
    }
  }
    updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Перевозчик'){
    this.state.deal688['сarrier']=decoded.sub
    this.state.deal688['sender']=''
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Отправителем'){
      this.state.deal688['sender']=decoded.sub
      this.state.deal688['сarrier']=''
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal688['sender']=''
      this.state.deal688['сarrier']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  render() {
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор перевозки</h3>
      </div>
   <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="Перевозчик">Перевозчик</option>
        <option value="Отправителем">Отправителем</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Отправитель</label>  
                           {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="sender" onChange={this.deal688}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Перевозчик</label>  
                   {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="сarrier" onChange={this.deal688}>
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
        <label className="form-control-label" htmlFor="inputNameAddShop">Перевозимое имущество</label>
        <input onChange={this.deal688} type="text" className="form-control" id="inputNameAddShop" name="transportableproperty"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Адрес отправки</label>
        <input onChange={this.deal688}  type="text" className="form-control" id="inputNameAddShop" name="shippingaddress"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Адрес доставки</label>
        <input onChange={this.deal688} type="text" className="form-control" id="inputNameAddShop" name="deliveryaddress"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Получатель имущества</label>
        <input onChange={this.deal688}  type="text" className="form-control" id="inputNameAddShop" name="recipientofproperty"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок доставки</label>
          <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({shippingday: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Цена доставки</label>
        <input onChange={this.deal688}  type="number" className="form-control" id="inputNameAddShop" name="shippingprice"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Порядок оплаты</label>
            <input onChange={this.deal688}  type="text" className="form-control" id="inputNameAddShop" name="payday"   autoComplete="off" />

      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок действия договора</label>
            <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Дополнительные условия (не обязательное ус-ие)                            </label>
        <input onChange={this.deal688}  type="text" className="form-control" id="inputNameAddShop" name="additional"  autoComplete="off" />
      </div>
         {(this.state.status1=='Индивидуальный предприниматель')?(
        <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Ваша роль в этой сделке</label>
        <select id="citySelectorAddShopForm" onChange={this.handleOptionChangeFiz.bind(this)}className="form-control">
            <option value='Индивидуальный предприниматель'>Индивидуальный предприниматель</option>
            <option value='Физическое Лицо'>Физическое Лицо</option>
        </select>
        </div>
        ):(<div></div>)}
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.updateDeal.bind(this)} className="btn btn-primary btn-block btn-round">Создать сделку</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;