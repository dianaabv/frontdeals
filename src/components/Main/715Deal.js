// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import Auth from '../modules/Auth';
import swal from 'sweetalert'

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      kontragents: [],
      me: {},
      loanterm: '',
      deadline: '',
      duedate: '',
      side1: '',
      lawid: '715',
      deal715: {
        side2: '',
        loanamount: '',
        awardamount: '',
        additional: ''
      },
      checkContent: false
    }
    this.deal715=this.deal715.bind(this)
    this.updateDeal715=this.updateDeal715.bind(this)
  }
  componentDidMount() {
      axios.get('http://185.100.67.106:4040/api/getmypersonalinfo',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           me: res.data.me,
           side1: res.data.me._id
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
  checkContent(){
    if((this.state.side1.length>0)&&(this.state.deal715.side2.length>0)&&(this.state.deal715.loanamount.length>0)&& (this.state.deal715.awardamount.length>0)&&(String(this.state.duedate).length>0) && (String(this.state.deadline).length>0)){
      this.setState({
        checkContent: true
      })
    }else {
          this.setState({
            checkContent: false
          })
        }
  }
  deal715(event){
    const field = event.target.name;
    const deal715 = this.state.deal715;
    deal715[field] = event.target.value;
    console.log(this.state.deal715, this.state.loanterm, this.state.deadline, this.state.duedate)
    this.checkContent();
  }
    updateDeal715(event){
      const formData = `side1=${this.state.side1}&deal715=${JSON.stringify(this.state.deal715)}&duedate=${this.state.duedate}&deadline=${this.state.deadline}&lawid=${this.state.lawid}&loanterm=${this.state.loanterm}`;
      axios.post('http://185.100.67.106:4040/api/createdeal715',formData,{
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



  render() {
    //console.log(this.state.kontragents)
   // console.log(this.state.side1, 'qqqqq')
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h2>Договор займа</h2>
      <h3>Предмет договора: Займодатель передает, а в случаях, предусмотренных настоящим договором, обязуется передать в собственность деньги или вещи, а заемщик обязуется своевременно возвратитьм займодателю такую же сумму денег или равное количество вещей того же рода и качества, на условиях указанных в настоящем договоре.</h3>
      </div>
   
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Сторона 1 (Заниматель) </label>  
        <h4>{this.state.me.firstname} {this.state.me.lastname} </h4>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Сторона 2</label>  
           {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="side2" onChange={this.deal715}>
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
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Cумма займа*</label><br/>
        <label className="form-control-label" htmlFor="inputNameAddShop">Вы указываете сумму в тенге</label>
        <input onChange={this.deal715} type="number" className="form-control"   name="loanamount"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок займа</label>
            <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({loanterm: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Размер вознаграждения</label>
        <input onChange={this.deal715}  type="number" className="form-control"   name="awardamount"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Сроки и порядок выплаты вознаграждения</label>
          <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({deadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок действия договора</label>
            <DatePickerInput    returnFormat='YYYY-MM-DD'
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
       <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Дополнительные условия (не обязательное ус-ие)                            </label>
        <input onChange={this.deal715} type="text" className="form-control"   name="additional"  autoComplete="off" />
      </div>
      <div className="form-group">
        <button   disabled={!this.state.checkContent}  type="button" onClick={this.updateDeal715} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;