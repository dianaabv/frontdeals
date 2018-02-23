// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import Auth from '../modules/Auth'
import jwtDecode from 'jwt-decode';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' 

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      duedate: '',
      deadline: '',
      goreceiver: '',
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

  }
  componentDidMount() {
      axios.get('http://185.100.67.106:4040/api/getmykontragents',{
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'}
        'Authorization': `bearer ${Auth.getToken()}`
      }).then(res => {
          this.setState({
           users: res.data.users
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
    if(this.state.deal506.presenter, this.state.deal506.receiver, this.state.deal506.itemname, this.state.deal506.quantity, this.state.deal506.additional, this.state.duedate, this.state.deadline){
      this.setState({
        checkContent: true
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
  }
  updateDeal506(event){
      const formData = `deal506=${JSON.stringify(this.state.deal506)}&duedate=${this.state.duedate}&deadline=${this.state.deadline}`;
      axios.post('http://185.100.67.106:4040/api/createdeal506',formData,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
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
 

  render() {
    
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Мои Сделки</h3>
      </div>
   
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option selected disabled>Выберите</option>
        <option value="Даритель">Даритель</option>
        <option value="Одаряемый">Одаряемый</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
            <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Одаряемый </label> <br/ >
         {
                                                    this.state.users.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="receiver"  onChange={this.deal506}>
                                                    <option value=''>Выберите контрагента</option>
                                                    {this.state.users.map((user, s) =>
                                                      <option key={s} value={user._id}>{user.firstname} {user.lastname}</option>
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
                                                    this.state.users.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="presenter"  onChange={this.deal506}>
                                                    <option value=''>Выберите контрагента</option>
                                                    {this.state.users.map((user, s) =>
                                                      <option key={s} value={user._id}>{user.firstname} {user.lastname}</option>
                                                    )}
                                                    </select>) : 
                                                    ( <select id="citySelectorAddShopForm" className="form-control">
                                                    <option value=''>У вас пока нет контрагентов</option>
                                                    </select>
                                                    )
                                                  }
      </div>
        ) :(
<p></p>
        )}
  
      <div className="form-group">
        <label className="form-control-label"  >Наименование дара (вещи или имущественного права (требование) либо освобождения от имущественной обязанности)</label>
        <input onChange={this.deal506}  type="text" className="form-control"  " name="itemname" placeholder="Имя" autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Количество дара</label>
        <input onChange={this.deal506}  type="text" className="form-control"  " name="quantity" placeholder="Имя" autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок передачи дара(момент перехода права собственности)</label>
            <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({deadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок действия договора</label>
            <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Дополнительные условия (не обязательное ус-ие)                            </label>
        <input onChange={this.deal506}  type="text" className="form-control"  " name="additional"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button  disabled={!this.state.checkContent} type="button" onClick={this.updateDeal506} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;