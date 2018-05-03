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
      duedate_err: '',
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
      status: 'Физическое лицо',
      valid_err: []
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
      var deal688_z = {
        сarrier: this.state.deal688.сarrier,
        sender: this.state.deal688.sender,
        transportableproperty: this.state.deal688.transportableproperty,
        shippingaddress: this.state.deal688.shippingaddress,
        payday: this.state.deal688.payday,
        deliveryaddress: this.state.deal688.deliveryaddress,
        recipientofproperty: this.state.deal688.recipientofproperty,
        shippingprice: this.state.deal688.shippingprice,
      }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(deal688_z)
      var valid_err = Object.keys(mainobj)
      this.setState({
        valid_err: valid_err
      })
      if(this.state.duedate==""){
        this.setState({
          duedate_err: '1'
        })
      } else {
        this.setState({
          duedate_err: ''
        })
      }
      if(this.state.shippingday==""){
        this.setState({
          shippingday_err: '1'
        })
      } else {
        this.setState({
          shippingday_err: ''
        })
      }
      if((this.state.deal688.сarrier.length>0)&&(this.state.deal688.sender.length>0)&&
          (this.state.deal688.transportableproperty.length>0)&&(this.state.deal688.shippingaddress.length>0)
          &&(this.state.deal688.deliveryaddress.length>0)&&(this.state.deal688.recipientofproperty.length>0)
          &&(this.state.deal688.shippingprice.length>0)
      &&(this.state.deal688.payday.length>0)&&(this.state.duedate>0)&&(this.state.shippingday>0)){

const formData = `deal688=${JSON.stringify(this.state.deal688)}&сarrier=${this.state.deal688.сarrier}&sender=${this.state.deal688.sender}&duedate=${this.state.duedate}&shippingday=${this.state.shippingday}&lawid=${this.state.lawid}&status=${this.state.status}`;

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
    if(this.state.deal688.sender.length == 0){
      this.state.deal688['sender']=''
    } else {
      this.state.deal688['sender']=this.state.deal688.сarrier
    }
    this.state.deal688['сarrier']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Отправителем'){
      if(this.state.deal688.сarrier.length == 0){
        this.state.deal688['сarrier']=''
      } else {
        this.state.deal688['сarrier']=this.state.deal688.sender
      }
      this.state.deal688['sender']=decoded.sub
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
      const today=new Date();
  //  today.setDate(today.getDate() + 1)
    today.setDate(today.getDate())
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор перевозки</h3>
      <h4><b className="cust_weigh">Предмет договора: </b> Перевозчик обязуется доставить вверенный ему Отправителем груз в пункт назначения и выдать уполномоченному на получение груза лицу (получателю), а отправитель обязуется уплатить за перевозку груза плату на условиях, указанных в настоящем договоре.</h4>
      </div>
   <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="Перевозчик">Перевозчиком</option>
        <option value="Отправителем">Отправителем</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Отправитель</label>
                           {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("sender")  ? 'input_err' : '')}  name="sender" onChange={this.deal688}>
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
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("сarrier")  ? 'input_err' : '')}  name="сarrier" onChange={this.deal688}>
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
        <label className="form-control-label"  >Перевозимое имущество</label>
        <input onChange={this.deal688} type="text"  className={"form-control " + (this.state.valid_err.includes("transportableproperty")  ? 'input_err' : '')}    name="transportableproperty"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Адрес отправки</label>
        <input onChange={this.deal688}  type="text" className={"form-control " + (this.state.valid_err.includes("shippingaddress")  ? 'input_err' : '')}     name="shippingaddress"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Адрес доставки</label>
        <input onChange={this.deal688} type="text" className={"form-control " + (this.state.valid_err.includes("deliveryaddress")  ? 'input_err' : '')}    name="deliveryaddress"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Получатель имущества</label>
        <input onChange={this.deal688}  type="text" className={"form-control " + (this.state.valid_err.includes("recipientofproperty")  ? 'input_err' : '')}    name="recipientofproperty"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок доставки</label>
          <DatePickerInput      minDate={today}
                                className={"my-react-datepicker " + (this.state.shippingday_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({shippingday: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Цена доставки, тенге</label>
        <input onChange={this.deal688}  type="number" className={"form-control " + (this.state.valid_err.includes("shippingprice")  ? 'input_err' : '')}     name="shippingprice"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Порядок оплаты</label>
            <input onChange={this.deal688}  type="text" className={"form-control " + (this.state.valid_err.includes("payday")  ? 'input_err' : '')}     name="payday"   autoComplete="off" />

      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок действия договора</label>
            <DatePickerInput    minDate={today}
                                className={"my-react-datepicker " + (this.state.duedate_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Дополнительные условия (не обязательное ус-ие)                            </label>
        <input onChange={this.deal688}  type="text" className="form-control"   name="additional"  autoComplete="off" />
      </div>
         {(this.state.status1=='Индивидуальный предприниматель')?(
        <div className="form-group">
        <label className="form-control-label"  >Ваша роль в этой сделке</label>
        <select id="citySelectorAddShopForm" onChange={this.handleOptionChangeFiz.bind(this)}className="form-control">
            <option value='Физическое Лицо'>Физическое Лицо</option>
            <option value='Индивидуальный предприниматель'>Индивидуальный предприниматель</option>

        </select>
        </div>
        ):(<div></div>)}
          <label className="form-control-label"  >*Настоящий договор регулируется законодательством Республики Казахстана</label>
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.updateDeal.bind(this)} className="btn btn-primary btn-block btn-round">Создать сделку</button>
      </div>
    </div>

                   );
  }
}export default Deals;
