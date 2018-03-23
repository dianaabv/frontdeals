// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import swal from 'sweetalert'

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      kontragents: [],
      me: {},
      loanterm: '',
      duedate: '',
      duedate_err: '',
      loanterm_err: '',
      deal715: {
        giver: '',
        borrower: '',
        loanamount: '',
        awardamount: '',
        additional: '',
        deadline: ''
      },
      role: '',
      goreceiver: '',
      lawid: '715',
      status1: '',
      status: 'Физическое лицо',
      valid_err: []
    }
    this.deal715=this.deal715.bind(this)
    this.updateDeal715=this.updateDeal715.bind(this)
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
  deal715(event){
    const field = event.target.name;
    const deal715 = this.state.deal715;
    deal715[field] = event.target.value;
  }
    updateDeal715(event){
      var deal715_z = {
        giver: this.state.deal715.giver,
        borrower: this.state.deal715.borrower,
        loanamount: this.state.deal715.loanamount,
        awardamount: this.state.deal715.awardamount,
        deadline: this.state.deal715.deadline
      }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(deal715_z)
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
      if(this.state.loanterm==""){
        this.setState({
          loanterm_err: '1'
        })
      } else {
        this.setState({
          loanterm_err: ''
        })
      }
      if(valid_err.length == 0 && this.state.duedate_err!='1'&& this.state.loanterm_err!='1'){
      const formData = `deal715=${JSON.stringify(this.state.deal715)}&giver=${this.state.deal715.giver}&borrower=${this.state.deal715.borrower}&duedate=${this.state.duedate}&loanterm=${this.state.loanterm}&lawid=${this.state.lawid}&status=${this.state.status}`;
        axios.post('http://185.100.67.106:4040/create/createdeal715',formData,{
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
    if(event.target.value=='заемщик'){
    if(this.state.deal715.giver.length == 0){
      this.state.deal715['giver']=''
    } else{
      this.state.deal715['giver']=this.state.deal715.borrower
    }
    this.state.deal715['borrower']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='заимодатель'){
      if(this.state.deal715.borrower==0){
        this.state.deal715['borrower']=''
      } else{
        this.state.deal715['borrower']=this.state.deal715.giver
      }
       this.state.deal715['giver']=decoded.sub
      //this.state.deal616['employer']=this.state.deal616.employee
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal715['borrower']=''
      this.state.deal715['giver']=''
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
      <h2>Договор займа</h2>
      <h4><b className="cust_weigh">Предмет договора: </b> Займодатель передает, а в случаях, предусмотренных настоящим договором, обязуется передать в собственность деньги или вещи, а заемщик обязуется своевременно возвратитьм займодателю такую же сумму денег или равное количество вещей того же рода и качества, на условиях указанных в настоящем договоре.</h4>
      </div>
       <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="заимодатель">Заимодатель</option>
        <option value="заемщик">Заемщику</option>
        </select>
      </div>
                  {(this.state.goreceiver=='ok')?(
         <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Заимодатель</label>  
          {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm"
                                                      className={"form-control " + (this.state.valid_err.includes("giver")  ? 'input_err' : '')} 
                                                      name="giver" onChange={this.deal715}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Заемщик</label>  
        {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm"
                                                     className={"form-control " + (this.state.valid_err.includes("borrower")  ? 'input_err' : '')} 
                                                     name="borrower"
                                                     onChange={this.deal715}>
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
        <label className="form-control-label"  >Cумма займа* (тенге)</label><br/>
        <input onChange={this.deal715} type="number"  className={"form-control " + (this.state.valid_err.includes("loanamount")  ? 'input_err' : '')}   name="loanamount"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Срок займа</label>
            <DatePickerInput    minDate={today} className={"my-react-datepicker " + (this.state.loanterm_err=="1"  ? 'date_input_err' : '')}
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({loanterm: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Размер вознаграждения</label>
        <input onChange={this.deal715}  type="number" className={"form-control " + (this.state.valid_err.includes("awardamount")  ? 'input_err' : '')}   name="awardamount"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок выплаты вознаграждения</label>
                  <input onChange={this.deal715}  type="text" className={"form-control " + (this.state.valid_err.includes("deadline")  ? 'input_err' : '')}     name="deadline"   autoComplete="off" />
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
        <input onChange={this.deal715} type="text" className="form-control"   name="additional"  autoComplete="off" />
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
        <button     type="button" onClick={this.updateDeal715} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;