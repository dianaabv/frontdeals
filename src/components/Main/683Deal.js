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
import swal from 'sweetalert';

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kontragents: [],
      deadline: '',
      deadline_err: '',
      // paydeadline: '',
      duedate: '',
      duedate_err: '',
      deal683: {
        employer: '',
        employee: '',
        description: '',
        price: '',
        quality: '',
        paydeadline: '',
        additional: ''
      },
      role: '',
      goreceiver: '',
      lawid: '683',
      status1: '',
      status: 'Физическое лицо',
      valid_err: []
    }
    this.deal683=this.deal683.bind(this)
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
    updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Исполнитель'){
    if(this.state.deal683.employer.length == 0){
      this.state.deal683['employer']=''
    } else{
      this.state.deal683['employer']=this.state.deal683.employee
    }
    this.state.deal683['employee']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Подрядчик'){
      if(this.state.deal683.employee==0){
        this.state.deal683['employee']=''
      } else{
        this.state.deal683['employee']=this.state.deal683.employer
      }
       this.state.deal683['employer']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal683['employee']=''
      this.state.deal683['employer']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
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
  deal683(event){
    const field = event.target.name;
    const deal683 = this.state.deal683;
    deal683[field] = event.target.value;
    console.log(this.state.deal683, this.state.deadline,  this.state.duedate)
  }
    updateDeal(){
      var deal683_z = {
        employer: this.state.deal683.employer,
        employee: this.state.deal683.employee,
        description: this.state.deal683.description,
        price: this.state.deal683.price,
        quality: this.state.deal683.quality,
        paydeadline: this.state.deal683.paydeadline,
 
      }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(deal683_z)
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
      if(this.state.deadline==""){
        this.setState({
          deadline_err: '1'
        })
      } else {
        this.setState({
          deadline_err: ''
        })
      }
      if(valid_err.length == 0 && this.state.duedate_err!='1'&& this.state.deadline_err!='1'){
        
        const formData = `deal683=${JSON.stringify(this.state.deal683)}&employer=${this.state.deal683.employer}&employee=${this.state.deal683.employee}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}&deadline=${this.state.deadline}`;
      axios.post('http://185.100.67.106:4040/create/createdeal683',formData,{
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

      } else{
        swal("Проверьте поля")
      }
    }

  render() {
      const today=new Date();
    today.setDate(today.getDate() + 1)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор возмездного оказания услуг</h3>
      <h4> <b className="cust_weigh">Предмет договора: </b> Исполнитель обязуется оказать услуги (совершить определенные действия или осуществить определенную деятельность), а Заказчик обязуется оплатить эти услуги на условиях, указанных в настоящем договоре.</h4>
      </div>
        <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="Исполнитель">Исполнителем</option>
        <option value="Подрядчик">Подрядчиком</option>
        </select>
      </div>
            {(this.state.goreceiver=='ok')?(
         <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Подрядчик</label>  
          {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("employer")  ? 'input_err' : '')} name="employer" onChange={this.deal683}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Исполнитель</label>  
        {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("employee")  ? 'input_err' : '')}  name="employee" onChange={this.deal683}>
                                                    <option value='' >Выберите контрагента</option>
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
        <label className="form-control-label"  >Описание услуг</label>
        <input onChange={this.deal683}  type="text" className={"form-control " + (this.state.valid_err.includes("description")  ? 'input_err' : '')} name="description"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок оказания услуг</label>
          <DatePickerInput      minDate={today}
                                className={"my-react-datepicker " + (this.state.deadline_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({deadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Цена услуг, тенге</label>
        <input onChange={this.deal683}  type="number" className={"form-control " + (this.state.valid_err.includes("price")  ? 'input_err' : '')}    name="price"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты</label>
            <input onChange={this.deal683}  type="text" className={"form-control " + (this.state.valid_err.includes("paydeadline")  ? 'input_err' : '')}    name="paydeadline"   autoComplete="off" />


      </div>
      <div className="form-group">
        <label className="form-control-label"  >Качество услуг</label>
           <input onChange={this.deal683}  type="text" className={"form-control " + (this.state.valid_err.includes("quality")  ? 'input_err' : '')}    name="quality"   autoComplete="off" />
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
        <input onChange={this.deal683} type="text" className="form-control"    name="additional"  autoComplete="off" />
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
        <button   type="button" onClick={this.updateDeal.bind(this)} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;