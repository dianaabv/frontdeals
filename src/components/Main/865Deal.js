// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import swal from 'sweetalert';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lawid: '865',
      kontragents: [],
      duedate: '',
      duedate_err: '',
      goreceiver: '',
      role: '',
      deal865: {
        agent: '',
        principal: '',
        payday: '',
        instructionprincipal: '',
        sizeaward: '',
        order: '',
        additional: ''
      },
      valid_err: [],
      status1: '',
      status: 'Физическое лицо'
    }
    this.deal865=this.deal865.bind(this)
    this.updateRole = this.updateRole.bind(this)
    this.updateDeal865=this.updateDeal865.bind(this)

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
  deal865(event){
    const field = event.target.name;
    const deal865 = this.state.deal865;
    deal865[field] = event.target.value;
  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Комиссионер'){
    if(this.state.deal865.principal.length == 0){
      this.state.deal865['principal']=''
    } else{
      this.state.deal865['principal']=this.state.deal865.agent
    }
    this.state.deal865['agent']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Комитента'){
    if(this.state.deal865.agent.length == 0){
      this.state.deal865['agent']=''
    } else{
      this.state.deal865['agent']=this.state.deal865.principal
    }

      this.state.deal865['principal']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal865['agent']=''
      this.state.deal865['principal']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  updateDeal865(event) {
      var deal865_z = {
        agent: this.state.deal865.agent,
        principal: this.state.deal865.principal,
        instructionprincipal: this.state.deal865.instructionprincipal,
        sizeaward: this.state.deal865.sizeaward,
        order: this.state.deal865.order,
        payday: this.state.deal865.payday
      }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(deal865_z)
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
      // if(this.state.payday==""){
      //   this.setState({
      //     payday_err: '1'
      //   })
      // } else {
      //   this.setState({
      //     payday_err: ''
      //   })
      // }
    if((this.state.deal865.principal.length>0)&&(this.state.deal865.agent.length>0)&&(this.state.deal865.instructionprincipal.length>0)&&(this.state.deal865.sizeaward.length>0)&&(this.state.deal865.order.length>0)
      &&(this.state.duedate>0)){
      const formData = `deal865=${JSON.stringify(this.state.deal865)}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}`;
      axios.post('http://185.100.67.106:4040/api/createdeal865',formData,{
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
   // console.log(this.state.deal865)
   //console.log(this.state.status)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор комиссии</h3>
      <h4><b className="cust_weigh">Предмет договора: </b>Комиссионер обязуется по поручению Комитента за вознаграждение совершить одну или несколько сделок от своего имени за счет Комитента на условиях, указанных в настоящем договоре. </h4>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="Комиссионер">Комиссионером</option>
        <option value="Комитента">Комитентом</option>
        </select>
      </div>

            {(this.state.goreceiver=='ok')?(
                  <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Комитента</label>  
                           {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("principal")  ? 'input_err' : '')} name="principal" onChange={this.deal865}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Комиссионер</label>  
                           {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("agent")  ? 'input_err' : '')} name="agent" onChange={this.deal865}>
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
        <label className="form-control-label"  >Указания комитента</label>
        <input  onChange={this.deal865}  type="text" className={"form-control " + (this.state.valid_err.includes("instructionprincipal")  ? 'input_err' : '')}  name="instructionprincipal"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Размер комиссионного вознаграждения, тенге</label>
         <input onChange={this.deal865}  type="number" className={"form-control " + (this.state.valid_err.includes("sizeaward")  ? 'input_err' : '')}  name="sizeaward"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты комиссионного вознаграждения </label>
            <input onChange={this.deal865}  type="text" className={"form-control " + (this.state.valid_err.includes("payday")  ? 'input_err' : '')}  name="payday"   autoComplete="off" />

      </div>
      <div className="form-group">
        <label className="form-control-label"  >Порядок возмещения расходов по исполнению комиссионного поручения</label>
        <input  onChange={this.deal865} type="text" className={"form-control " + (this.state.valid_err.includes("order")  ? 'input_err' : '')}  name="order"   autoComplete="off" />
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
        <input  onChange={this.deal865} type="text" className="form-control"  name="additional"  autoComplete="off" />
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
        <button   type="button" onClick={this.updateDeal865} className="btn btn-primary btn-block btn-round">Cоздать сделку</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;