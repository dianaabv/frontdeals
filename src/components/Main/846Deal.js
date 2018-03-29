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

      termofassignment: '',
      duedate: '',
      deal846: {
        attorney: '',
        principal: '',
        description: '',
        priceaward: '',
        payday: '',
        rules: '',
        additional: ''
      },
      duedate_err: '',
      termofassignment_err: '',
      message: '',
      lawid: '846',
      status1: '',
      status: 'Физическое лицо',
      valid_err: [],
      goreceiver: '',
      role: '',
    }
    this.deal846=this.deal846.bind(this)
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
  deal846(event){
    const field = event.target.name;
    const deal846 = this.state.deal846;
    deal846[field] = event.target.value;
  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Поверенный'){
    if(this.state.deal846.principal.length == 0){
      this.state.deal846['principal']=''
    } else{
      this.state.deal846['principal']=this.state.deal846.attorney
    }
    this.state.deal846['attorney']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Доверитель'){

      if(this.state.deal846.attorney ==0){
        this.state.deal846['attorney']=''
      } else{
        this.state.deal846['attorney']=this.state.deal846.principal
      }
      this.state.deal846['principal']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal604['principal']=''
      this.state.deal604['attorney']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }

  updateDeal(event){
     var dealz = {
        attorney: this.state.deal846.attorney,
        principal: this.state.deal846.principal,
        description: this.state.deal846.description,
        priceaward: this.state.deal846.priceaward,
        payday: this.state.deal846.payday,
        rules: this.state.deal846.rules,
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
      if(this.state.termofassignment==""){
        this.setState({
          termofassignment_err: '1'
        })
      } else {
        this.setState({
          termofassignment_err: ''
        })
      }
          if(valid_err.length == 0 && this.state.duedate_err!='1' && this.state.termofassignment_err!='1'){
            const formData = `deal846=${JSON.stringify(this.state.deal846)}&attorney=${this.state.deal846.attorney}&principal=${this.state.deal846.principal}&duedate=${this.state.duedate}&termofassignment=${this.state.termofassignment}&lawid=${this.state.lawid}&status=${this.state.status}`;
            axios.post('http://185.100.67.106:4040/create/createdeal846',formData,{
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
          }
          else{
              swal('Проверьте Поля')
          }
}


  render() {
    const today=new Date();
    today.setDate(today.getDate() + 1)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор поручения</h3>
      <h4><b className="cust_weigh">Предмет договора: </b>Поверенный обязуется совершить от имени и за счет другой стороны Доверителя, определенные юридические действия на условиях, указанных в настоящем договоре. По сделке, совершенной поверенным, права и обязанности возникают непосредственно у Доверителя.</h4>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="Поверенный">Поверенным</option>
        <option value="Доверитель">Доверитеем</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
        <div className="form-group">
          <label className="form-control-label" htmlFor="citySelectorAddShopForm">Доверитель</label>
                         {
                                                      this.state.kontragents.length!=0 ?
                                                      (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("principal")  ? 'input_err' : '')} name="principal" onChange={this.deal846}>
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
            <label className="form-control-label" htmlFor="citySelectorAddShopForm">Поверенный</label>
                          {
                                                        this.state.kontragents.length!=0 ?
                                                        (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("attorney")  ? 'input_err' : '')}  name="attorney" onChange={this.deal846}>
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
        <label className="form-control-label"  >Описание поручаемых действий</label>
        <input onChange={this.deal846}  type="text" className={"form-control " + (this.state.valid_err.includes("description")  ? 'input_err' : '')}   name="description"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок поручения</label>
            <DatePickerInput    minDate={today}
                                className={"my-react-datepicker " + (this.state.termofassignment_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({termofassignment: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label">Размер вознаграждения поверенного, тенге</label>
        <input onChange={this.deal846}  type="number" className={"form-control " + (this.state.valid_err.includes("priceaward")  ? 'input_err' : '')}   name="priceaward"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты вознаграждения</label>
                  <input onChange={this.deal846}  type="text" className={"form-control " + (this.state.valid_err.includes("payday")  ? 'input_err' : '')}   name="payday"   autoComplete="off" />


      </div>
      <div className="form-group">
        <label className="form-control-label"  >Указания доверителя</label>
        <input onChange={this.deal846}  type="text" className={"form-control " + (this.state.valid_err.includes("rules")  ? 'input_err' : '')}   name="rules"   autoComplete="off" />
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
        <input onChange={this.deal846}  type="text" className="form-control"  name="additional"  autoComplete="off" />
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
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>

                   );
  }
}export default Deals;
