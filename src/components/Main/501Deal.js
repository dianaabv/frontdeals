// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js'
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import swal from 'sweetalert'


 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kontragents: [],
      duedate: '',
      //deadline: '',

      deal501: {
        side1: '',
        side2: '',
        itemname1: '',
        quantity1: '',
        price1: '',
        quality1: '',
        description1: '',
        state1:'',
        itemname2: '',
        quantity2: '',
        price2: '',
        quality2: '',
        description2: '',
        state2: '',
        deadline: '',
        additional: ''
      },
      duedate_err: '',
      message: '',
      lawid: '501',
      status1: '',
      status: 'Физическое лицо',
      valid_err: [],
      goreceiver: '',
      role: '',
    }
    this.deal501=this.deal501.bind(this);
    this.updateRole=this.updateRole.bind(this)
    this.updateDeal=this.updateDeal.bind(this)


  }
  componentWillMount(){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    this.setState({
      status1: decoded.userstatus
    })
  }
    handleOptionChangeFiz(event){
    //console.log(event.target.value)
    this.setState({
      status: event.target.value
    });
  }
  componentDidMount() {
      axios.get('https://sdelkibackend.herokuapp.com/api/getmykontragents',{
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
  deal501(event){
    const field = event.target.name;
    const deal501 = this.state.deal501;
    deal501[field] = event.target.value;
    // console.log(this.state.deal501, this.state.duedate, this.state.deadline)
  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='side1'){
    if(this.state.deal501.side2.length == 0){
      this.state.deal501['side2']=''
    } else{
      this.state.deal501['side2']=this.state.deal501.side1
    }
    this.state.deal501['side1']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='side2'){

      if(this.state.deal501.side1 ==0){
        this.state.deal501['side1']=''
      } else{
        this.state.deal501['side1']=this.state.deal501.side2
      }
      this.state.deal501['side2']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal501['side2']=''
      this.state.deal501['side1']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  updateDeal(event){

     var dealz = {
        side1: this.state.deal501.side1,
        side2: this.state.deal501.side2,
        itemname1: this.state.deal501.itemname1,
        quantity1: this.state.deal501.quantity1,
        price1: this.state.deal501.price1,
        quality1: this.state.deal501.quality1,
        description1: this.state.deal501.description1,
        state1: this.state.deal501.state1,
        itemname2: this.state.deal501.itemname2,
        quantity2: this.state.deal501.quantity2,
        price2: this.state.deal501.price2,
        quality2: this.state.deal501.quality2,
        description2: this.state.deal501.description2,
        state2: this.state.deal501.state2,
        deadline: this.state.deal501.deadline,
      }

      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(dealz)
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
    if(valid_err.length == 0 && this.state.duedate_err!='1'){
        const formData = `deal501=${JSON.stringify(this.state.deal501)}&side1=${this.state.deal501.side1}&side2=${this.state.deal501.side2}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}`;
        axios.post('https://sdelkibackend.herokuapp.com/create/createdeal501',formData,{
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
        swal('Проверьте Поля')
      }
}
  render() {
    const today=new Date();
    today.setDate(today.getDate() + 1)

    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор мены</h3>
      <h4><b className="cust_weigh">Предмет догвора: </b> Одна сторона передает другой и получает взамен имущество на условиях, указанных в настоящем договоре</h4>
        <h4><b className="cust_weigh">Внимание: </b> при выборе недвижимого имущества (дом, квартира, офис, помещение и т.д.) сделка должна быть выполнена в письменном виде и зарегистрирована в установленном законодательством порядке</h4>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="side1">Сторона 1</option>
        <option value="side2">Сторона 2</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
        <div className="form-group">
          <label className="form-control-label" htmlFor="citySelectorAddShopForm">Сторона 2</label>
          {
                                                      this.state.kontragents.length!=0 ?
                                                      (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("side2")  ? 'input_err' : '')} name="side2" onChange={this.deal501}>
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
            <label className="form-control-label" htmlFor="citySelectorAddShopForm">Сторона 1</label>
            {
                                                        this.state.kontragents.length!=0 ?
                                                        (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("side1")  ? 'input_err' : '')} name="side1" onChange={this.deal501}>
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
        <label className="form-control-label"  >Наименование имущества подлежащего передаче Стороной 1</label>
        <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("itemname1")  ? 'input_err' : '')}   name="itemname1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Количество имущества, подлежащего передаче Стороной 1</label>
        <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("quantity1")  ? 'input_err' : '')}   name="quantity1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Стоимость имущества,  подлежащего передаче Стороной 1</label>
        <input onChange={this.deal501}  type="number" className={"form-control " + (this.state.valid_err.includes("price1")  ? 'input_err' : '')}   name="price1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Качество имущества подлежащего передаче Стороной 1</label>
            <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("quality1")  ? 'input_err' : '')}  name="quality1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Характеристика имущества подлежащего передаче Стороной 1</label>
            <input onChange={this.deal501} type="text" className={"form-control " + (this.state.valid_err.includes("description1")  ? 'input_err' : '')}   name="description1"   autoComplete="off" />
      </div>

      <div className="form-group">
        <label className="form-control-label"  >Cостояние имущества подлежащего передаче Стороной 1</label>
        <select className={"form-control " + (this.state.valid_err.includes("state1")  ? 'input_err' : '')} name="state1" onChange={this.deal501} >
          <option selected disabled>Выберите</option>
          <option value="Б/У">Б/У</option>
          <option value="Новое">Новое</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Наименование имущества, подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("itemname2")  ? 'input_err' : '')}   name="itemname2"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Количество имущества, подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("quantity2")  ? 'input_err' : '')}   name="quantity2"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Стоимость имущества,  подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="number" className={"form-control " + (this.state.valid_err.includes("price2")  ? 'input_err' : '')}  name="price2"   autoComplete="off" />
      </div>
       <div className="form-group">
        <label className="form-control-label"  >Качество  имущества подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501} type="text" className={"form-control " + (this.state.valid_err.includes("quality2")  ? 'input_err' : '')}   name="quality2"   autoComplete="off" />
      </div>
       <div className="form-group">
        <label className="form-control-label"  >Характеристика имущества подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("description2")  ? 'input_err' : '')}   name="description2"   autoComplete="off" />
      </div>
       <div className="form-group">
        <label className="form-control-label"  >Cостояние имущества подлежащего передаче Стороной 2</label>
        <select className={"form-control " + (this.state.valid_err.includes("state2")  ? 'input_err' : '')} name="state2" onChange={this.deal501} >
          <option selected disabled>Выберите</option>
          <option value="Б/У">Б/У</option>
          <option value="Новое">Новое</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок обмена имуществом</label>
        <input onChange={this.deal501}  type="text" className={"form-control " + (this.state.valid_err.includes("deadline")  ? 'input_err' : '')}  name="deadline"   autoComplete="off" />

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
        <input onChange={this.deal501}  type="text" className="form-control"   name="additional"  autoComplete="off" />
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
        <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>

                   );
  }
}export default Deals;
