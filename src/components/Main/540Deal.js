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
      kontragents: [],
      // deadline: '',
      // payday: '',
      lawid: '540',
      kontragents: [],
      duedate: '',
      duedate_err: '',
      deal540: {
        employer: '',
        employee: '',
        itemdata: '',
        keepcondition: '',
        usecondition: '',
        payday: '',
        deadline: '',
        additional: '',
      },
      status1: '',
      status: 'Физическое лицо',
      valid_err: []
    }
    this.deal540=this.deal540.bind(this)
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
    //swal("Cделка будет недействительной в случае найма недвижимого имущества на срок от одного года и более. В таком случае необходимо заключить письменный договор и обратиться в Центр обслуживания населения по местонахождению недвижимого имущества для целей государственной регистрации такого договора.")
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
deal540(event){
    const field = event.target.name;
    const deal540 = this.state.deal540;
    deal540[field] = event.target.value;
    //console.log(this.state.deal540, this.state.deadline, this.state.payday, this.state.duedate)
}
updateDeal(){

    var deal540_z = {
      employer: this.state.deal540.employer,
      employee: this.state.deal540.employee,
      itemdata: this.state.deal540.itemdata,
      keepcondition: this.state.deal540.keepcondition,
      usecondition: this.state.deal540.usecondition,
      payday: this.state.deal540.payday,
      deadline: this.state.deal540.deadline,
    }
    const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
    var mainobj=removeEmpty(deal540_z)
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
      const formData = `deal540=${JSON.stringify(this.state.deal540)}&employer=${this.state.deal540.employer}&employee=${this.state.deal540.employee}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}`;
      axios.post('http://185.100.67.106:4040/create/createdeal540',formData,{
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
      swal('Проверьте Поля')
    }
}
updateRole(event){
var token = Auth.getToken();
var decoded = jwtDecode(token);
if(event.target.value=='Наймодатель'){
if(this.state.deal540.employee.length == 0){
  this.state.deal540['employee']=''
} else {
  this.state.deal540['employee']=this.state.deal688.employer
}
this.state.deal540['employer']=decoded.sub
this.setState({
  role:event.target.value,
  goreceiver: 'ok'
})
}
if(event.target.value=='Наниматель'){
  if(this.state.deal540.employer.length == 0){
    this.state.deal540['employer']=''
  } else {
    this.state.deal540['employer']=this.state.deal540.employee
  }
  this.state.deal540['employee']=decoded.sub
  this.setState({
    goreceiver: 'neok',
    role:event.target.value
  })
}
if(event.target.value=='0'){
  this.state.deal688['employee']=''
  this.state.deal688['employer']=''
  this.setState({
    goreceiver: '',
    role:'',
    checkContent: false
  })
}
}

  render() {
    const today=new Date();
  today.setDate(today.getDate() + 1)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор имущественного найма (аренды)</h3>
      <h4><b className="cust_weigh">Предмет договора: </b> Наймодатель предоставляет нанимателю имущество за плату во временное владение и пользование на условиях, указанных в настоящем договоре. Внимание: при выборе недвижимого имущества срок договора должен составлять менее года, иначе сделка должна быть выполнена в письменном виде и зарегистрирована в установленном законодательством порядке</h4>
      <h4><b className="cust_weigh">Внимание: </b> при выборе недвижимого имущества (дом, квартира, офис, помещение и т.д.) срок договора должен составлять менее года, иначе сделка должна быть выполнена в письменном виде и зарегистрирована в установленном законодательством порядке</h4>

      </div>
      <div className="form-group">
           <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
           <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
            <option value='0' >Выберите</option>
           <option value="Наймодатель">Наймодателем</option>
           <option value="Наниматель">Нанимателем</option>
           </select>
         </div>
         {(this.state.goreceiver=='ok')?(
           <div className="form-group">
             <label className="form-control-label" htmlFor="citySelectorAddShopForm">Наниматель</label>
              {
                                                         this.state.kontragents.length!=0 ?
                                                         (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("employee")  ? 'input_err' : '')} name="employee" onChange={this.deal540}>
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
               <label className="form-control-label" htmlFor="citySelectorAddShopForm">Наймодатель</label>
               {
                                                           this.state.kontragents.length!=0 ?
                                                           (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("employer")  ? 'input_err' : '')} name="employer" onChange={this.deal540}>
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
        <label className="form-control-label"  >Данные, позволяющие установить имущество, подлежащее передаче в аренду</label>
        <input onChange={this.deal540} type="text" className={"form-control " + (this.state.valid_err.includes("itemdata")  ? 'input_err' : '')}  name="itemdata"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Cроки и порядок передачи/возврата имущества</label>
          <input onChange={this.deal540} type="text" className={"form-control " + (this.state.valid_err.includes("deadline")  ? 'input_err' : '')}  name="deadline"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты</label>
                <input onChange={this.deal540} type="text" className={"form-control " + (this.state.valid_err.includes("payday")  ? 'input_err' : '')}  name="payday"   autoComplete="off" />


      </div>
      <div className="form-group">
        <label className="form-control-label"  >Условия о содержании/улучшении имущества</label>
        <input onChange={this.deal540}  type="text" className={"form-control " + (this.state.valid_err.includes("keepcondition")  ? 'input_err' : '')}   name="keepcondition"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Условия об использовании имущества (в т.ч. пределах распоряжения)</label>
        <input onChange={this.deal540} type="text" className={"form-control " + (this.state.valid_err.includes("usecondition")  ? 'input_err' : '')}   name="usecondition"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок действия договора</label>
            <DatePickerInput
            minDate={today}
                                className={"my-react-datepicker " + (this.state.duedate_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
       <div className="form-group">
        <label className="form-control-label"  >Дополнительные условия (не обязательное ус-ие)                            </label>
        <input onChange={this.deal540} type="text" className="form-control"   name="additional"  autoComplete="off" />
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
        <button   type="button"   onClick={this.updateDeal.bind(this)} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>

                   );
  }
}export default Deals;
