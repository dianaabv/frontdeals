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
      workdeadline: '',
      payday: '',
      deal616: {
        employer: '',
        employee: '',
        workdescription: '',
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
      status: 'Индивидуальный предприниматель'
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
    console.log(this.state.deal616, this.state.duedate, this.state.workdeadline, this.state.payday )

  }
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Подрядчик'){
    this.state.deal616['employer']=decoded.sub
    this.state.deal616['employee']=''
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Заказчик'){
      this.state.deal616['employee']=decoded.sub
      this.state.deal616['employer']=''
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
      if((this.state.deal616.employer.length>0)&&(this.state.deal616.employee.length>0)
        &&(this.state.deal616.workdescription.length>0)&&(this.state.deal616.workaddress.length>0)&&(this.state.deal616.workprice.length>0)
        &&(this.state.deal616.workcheck.length>0)&&(this.state.deal616.quantity.length>0)
        &&(this.state.payday>0)&&(this.state.duedate>0)&&(this.state.workdeadline>0)){
      const formData = `deal616=${JSON.stringify(this.state.deal616)}&duedate=${this.state.duedate}&payday=${this.state.payday}&lawid=${this.state.lawid}&status=${this.state.status}&workdeadline=${this.state.workdeadline}`;
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
    //console.log(this.state.deal616)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор подряда</h3>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="Подрядчик">Подрядчик</option>
        <option value="Заказчик">Заказчик</option>
        </select>
      </div>
            {(this.state.goreceiver=='ok')?(
         <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Заказчик</label>  
          {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="employee" onChange={this.deal616}>
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
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="employer" onChange={this.deal616}>
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
        <label className="form-control-label" htmlFor="inputNameAddShop">Описание работ</label>
        <input onChange={this.deal616}  type="text" className="form-control" id="inputNameAddShop" name="workdescription"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Адрес объекта при проведении работ по ремонту</label>
        <input onChange={this.deal616}  type="text" className="form-control" id="inputNameAddShop" name="workaddress"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок выполнения работ</label>
         <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({workdeadline: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Цена работ</label>
        <input onChange={this.deal616}  type="number" className="form-control" id="inputNameAddShop" name="workprice"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Сроки и порядок оплаты</label>
              <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({payday: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Порядок приема работ</label>
        <input onChange={this.deal616}  type="text" className="form-control" id="inputNameAddShop" name="workcheck"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Качество работ (гарантия качества работ)</label>
        <input onChange={this.deal616}  type="text" className="form-control" id="inputNameAddShop" name="quantity"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок действия договора</label>
            <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Дополнительные условия (не обязательное ус-ие)                            </label>
        <input onChange={this.deal616}  type="text" className="form-control" id="inputNameAddShop" name="additional"  autoComplete="off" />
      </div>
      {(this.state.status1=='Индивидуальный предприниматель')?(
        <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Ваша роль в этой сделке</label>
        <select id="citySelectorAddShopForm" onChange={this.handleOptionChangeFiz.bind(this)}className="form-control">
            <option value='Индивидуальный предприниматель'>Индивидуальный предприниматель</option>
            <option value='Физическое Лицо'>Физическое Лицо</option>
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