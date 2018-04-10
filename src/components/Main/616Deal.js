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
      duedate:'',
      duedate_err: '',
      workdeadline: '',
      workdeadline_err: '',
      // payday: '',
      // payday_err: '',
      deal616: {
        employer: '',
        employee: '',
        workdescription: '',
        payday: '',
        workaddress: '',
        workprice: '',
        workcheck: '',
        quantity: '',
        additional: ''
      },
      role: '',
      goreceiver: '',
      lawid: '616',
      status1: '',
      status: 'Физическое лицо',
      valid_err: []
    }
    this.deal616=this.deal616.bind(this)
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
  deal616(event){
    const field = event.target.name;
    const deal616 = this.state.deal616;
    deal616[field] = event.target.value;
  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Подрядчик'){
    if(this.state.deal616.employee.length == 0){
      this.state.deal616['employee']=''
    } else{
      this.state.deal616['employee']=this.state.deal616.employer
    }
    this.state.deal616['employer']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Заказчик'){
      if(this.state.deal616.employer==0){
        this.state.deal616['employer']=''
      } else{
        this.state.deal616['employer']=this.state.deal616.employee
      }
       this.state.deal616['employee']=decoded.sub
      //this.state.deal616['employer']=this.state.deal616.employee
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal616['employee']=''
      this.state.deal616['employer']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  updateDeal(){
      var deal616_z = {
        employer: this.state.deal616.employer,
        employee: this.state.deal616.employee,
        workdescription: this.state.deal616.workdescription,
        workaddress: this.state.deal616.workaddress,
        workprice: this.state.deal616.workprice,
        workcheck: this.state.deal616.workcheck,
        quantity: this.state.deal616.quantity,
        payday: this.state.deal616.payday
      }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(deal616_z)
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
      if(this.state.workdeadline==""){
        this.setState({
          workdeadline_err: '1'
        })
      } else {
        this.setState({
          workdeadline_err: ''
        })
      }

      if((this.state.deal616.employer.length>0)&&(this.state.deal616.employee.length>0)
        &&(this.state.deal616.workdescription.length>0)&&(this.state.deal616.workaddress.length>0)&&(this.state.deal616.workprice.length>0)
        &&(this.state.deal616.workcheck.length>0)&&(this.state.deal616.quantity.length>0)
    &&(this.state.duedate>0)&&(this.state.workdeadline>0)){
      const formData = `deal616=${JSON.stringify(this.state.deal616)}&employer=${this.state.deal616.employer}&employee=${this.state.deal616.employee}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}&workdeadline=${this.state.workdeadline}`;

      axios.post('http://185.100.67.106:4040/create/createdeal616',formData,{
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

  render() {
  const today=new Date();
    today.setDate(today.getDate() + 1)
     //console.log(this.state.valid_err)

    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3 >Договор подряда</h3>
      <h4><b className="cust_weigh"><b className="cust_weigh">Предмет договора: </b> </b>Подрядчик обязуется выполнить по заданию Заказчика определенную работу, а Заказчик обязуется оплатить такую работу на условиях, указанных в настоящем договоре.</h4>

      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="Подрядчик">Подрядчиком</option>
        <option value="Заказчик">Заказчиком</option>
        </select>
      </div>
            {(this.state.goreceiver=='ok')?(
         <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Заказчик</label>
          {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("employee")  ? 'input_err' : '')} name="employee" onChange={this.deal616}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Подрядчик</label>
        {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("employer")  ? 'input_err' : '')}  onChange={this.deal616}>
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
        <label className="form-control-label"  >Описание работ</label>
        <input onChange={this.deal616}  type="text" className={"form-control " + (this.state.valid_err.includes("workdescription")  ? 'input_err' : '')}   name="workdescription"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Адрес объекта при проведении работ по ремонту</label>
        <input onChange={this.deal616}  type="text" className={"form-control " + (this.state.valid_err.includes("workaddress")  ? 'input_err' : '')}  name="workaddress"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок выполнения работ</label>
         <DatePickerInput       minDate={today}
                                className={"my-react-datepicker " + (this.state.workdeadline_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({workdeadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Цена работ, тенге</label>
        <input onChange={this.deal616}  type="number" className={"form-control " + (this.state.valid_err.includes("workprice")  ? 'input_err' : '')}  name="workprice"    />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты</label>
              <input onChange={this.deal616}  type="text" className={"form-control " + (this.state.valid_err.includes("payday")  ? 'input_err' : '')}  name="payday"    />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Порядок приема работ</label>
        <input onChange={this.deal616}  type="text"className={"form-control " + (this.state.valid_err.includes("workcheck")  ? 'input_err' : '')}   name="workcheck"   />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Качество работ (гарантия качества работ)</label>
        <input onChange={this.deal616}  type="text" className={"form-control " + (this.state.valid_err.includes("quantity")  ? 'input_err' : '')}   name="quantity"    />
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
        <input onChange={this.deal616}  type="text" className="form-control"  name="additional"  autoComplete="off" />
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
        <button   type="button" onClick={this.updateDeal.bind(this)} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>

                   );
  }
}export default Deals;
