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
      //giveawaydeadline: '',
      usedeadline: '',
      duedate: '',
      goreceiver: '',
      role: '',
      deal604: {
        lender: '',
        borrower: '',
        itemdata: '',
        keepcondition: '',
        usecondition: '',
        additional: '',
        giveawaydeadline: ''
      },
      duedate_err: '',
      usedeadline_err: '',
      message: '',
      lawid: '604',
      status1: '',
      status: 'Физическое лицо',
      valid_err: []

    }
    this.deal604=this.deal604.bind(this)
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
  //  swal("Cделка будет недействительной в случае передачи в безвозмездное пользование недвижимого имущества на срок от одного года и более. В таком случае необходимо заключить письменный договор и обратиться в Центр обслуживания населения по местонахождению недвижимого имущества для целей государственной регистрации такого договора.")
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
  deal604(event){
    const field = event.target.name;
    const deal604 = this.state.deal604;
    deal604[field] = event.target.value;
  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Ссудодатель'){
    if(this.state.deal604.borrower.length == 0){
      this.state.deal604['borrower']=''
    } else{
      this.state.deal604['borrower']=this.state.deal604.lender
    }
    this.state.deal604['lender']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Ссудополучатель'){

      if(this.state.deal604.lender ==0){
        this.state.deal604['lender']=''
      } else{
        this.state.deal604['lender']=this.state.deal604.borrower
      }
      this.state.deal604['borrower']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal604['lender']=''
      this.state.deal604['borrower']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  updateDeal(event){

     var dealz = {
        lender: this.state.deal604.lender,
        borrower: this.state.deal604.borrower,
        itemdata: this.state.deal604.itemdata,
        keepcondition: this.state.deal604.keepcondition,
        usecondition: this.state.deal604.usecondition,
        giveawaydeadline: this.state.deal604.giveawaydeadline
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
      if(this.state.usedeadline==""){
        this.setState({
          usedeadline_err: '1'
        })
      } else {
        this.setState({
          usedeadline_err: ''
        })
      }
          if(valid_err.length == 0 && this.state.duedate_err!='1' && this.state.usedeadline_err!='1'){
            const formData = `deal604=${JSON.stringify(this.state.deal604)}&lender=${this.state.deal604.lender}&borrower=${this.state.deal604.borrower}&duedate=${this.state.duedate}&usedeadline=${this.state.usedeadline}&lawid=${this.state.lawid}&status=${this.state.status}`;
            axios.post('http://185.100.67.106:4040/create/createdeal604',formData,{
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
      <h3>Договор безвозмездного пользования имуществом</h3>
      <h4><b className="cust_weigh">Предмет договора: </b> Ссудодатель передает имущество в безвозмездное временное пользование Cсудополучателю на условиях, указанных в настоящем договоре</h4>
      <h4><b className="cust_weigh">Внимание: </b> при выборе недвижимого имущества (дом, квартира, офис, помещение и т.д.) сделка должна быть выполнена в письменном виде и зарегистрирована в установленном законодательством порядке</h4>

      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="Ссудодатель">Ссудодателем</option>
        <option value="Ссудополучатель">Ссудополучателем</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
        <div className="form-group">
          <label className="form-control-label" htmlFor="citySelectorAddShopForm">Ссудополучатель</label>
                   {
                                                      this.state.kontragents.length!=0 ?
                                                      (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("borrower")  ? 'input_err' : '')} name="borrower" onChange={this.deal604}>
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
            <label className="form-control-label" htmlFor="citySelectorAddShopForm">Ссудодатель</label>
                      {
                                                        this.state.kontragents.length!=0 ?
                                                        (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("lender")  ? 'input_err' : '')} name="lender" onChange={this.deal604}>
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
        <label className="form-control-label"  >Данные, позволяющие установить имущество, подлежащее передаче</label>
        <input onChange={this.deal604}  type="text" className={"form-control " + (this.state.valid_err.includes("itemdata")  ? 'input_err' : '')}   name="itemdata"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок передачи имущества</label>
                <input onChange={this.deal604}  type="text" className={"form-control " + (this.state.valid_err.includes("giveawaydeadline")  ? 'input_err' : '')}   name="giveawaydeadline"   autoComplete="off" />


      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок пользования имуществом</label>

            <DatePickerInput minDate={today}
                                className={"my-react-datepicker " + (this.state.usedeadline_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({usedeadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Условия о содержании имущества</label>
        <input onChange={this.deal604} type="text" className={"form-control " + (this.state.valid_err.includes("keepcondition")  ? 'input_err' : '')}   name="keepcondition"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Условия об использовании имущества</label>
        <input onChange={this.deal604}  type="text" className={"form-control " + (this.state.valid_err.includes("usecondition")  ? 'input_err' : '')}   name="usecondition"   autoComplete="off" />
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
        <input onChange={this.deal604}  type="text" className={"form-control " + (this.state.valid_err.includes("additional")  ? 'input_err' : '')}   name="additional"  autoComplete="off" />
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
