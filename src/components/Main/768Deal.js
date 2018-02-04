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
      lawid: '768',
      goreceiver: '',
      kontragents: [],
      shelfdate: '',
      payday: '',
      duedate: '',
      deal768:{
        keeper: '',
        bailor: '',
        itemname: '',
        awardamount: '',
        responsibility: '',
        additional: ''
      },
      status1: '',
      status: 'Индивидуальный предприниматель'
    }
    this.deal768=this.deal768.bind(this)
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
  deal768(event){
    const field = event.target.name;
    const deal768 = this.state.deal768;
    deal768[field] = event.target.value;
   // console.log(this.state.deal768, this.state.shelfdate, this.state.payday, this.state.duedate)
  }
  updateDeal768(event){
      if((this.state.deal768.keeper.length>0)&&(this.state.deal768.bailor.length>0)
        &&(this.state.deal768.itemname.length>0)&&(this.state.deal768.awardamount.length>0)&&(this.state.deal768.responsibility.length>0)
        &&(this.state.payday>0)&&(this.state.duedate>0)&&(this.state.shelfdate>0)){
      const formData = `deal768=${JSON.stringify(this.state.deal768)}&duedate=${this.state.duedate}&payday=${this.state.payday}&lawid=${this.state.lawid}&status=${this.state.status}&shelfdate=${this.state.shelfdate}`;
      axios.post('http://185.100.67.106:4040/create/createdeal768',formData,{
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
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='Хранитель'){
    this.state.deal768['keeper']=decoded.sub
    this.state.deal768['bailor']=''
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Поклажедателем'){
      this.state.deal768['bailor']=decoded.sub
      this.state.deal768['keeper']=''
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal768['keeper']=''
      this.state.deal768['bailor']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }

  render() {
    console.log(this.state.shelfdate)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор хранения</h3>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>  
        <select className="form-control" name="role" onChange={this.updateRole.bind(this)}>
         <option value='0' >Выберите</option>
        <option value="Хранитель">Хранитель</option>
        <option value="Поклажедателем">Поклажедателем</option>
        </select>
      </div>

            {(this.state.goreceiver=='ok')?(
                  <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Поклажедатель</label>  
                                {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="bailor" onChange={this.deal768}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Хранитель</label>  
                    {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="keeper" onChange={this.deal768}>
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
        <label className="form-control-label" htmlFor="inputNameAddShop">Вещь, передаваемая на хранение</label>
        <input onChange={this.deal768}  type="text" className="form-control" id="inputNameAddShop" name="itemname"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Срок хранения</label>
         <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({shelfdate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Вознаграждение и возмещение расходов хранителю</label>
        <input onChange={this.deal768}  type="number" className="form-control" id="inputNameAddShop" name="awardamount"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Сроки и порядок оплаты  </label>
          <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({payday: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Ответственность за несохранность</label>
        <input onChange={this.deal768}  type="text" className="form-control" id="inputNameAddShop" name="responsibility"   autoComplete="off" />
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
        <label className="form-control-label" htmlFor="inputNameAddShop">Дополнительные условия</label>
        <input onChange={this.deal768}  type="text" className="form-control" id="inputNameAddShop" name="additional"  autoComplete="off" />
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
        <button type="button" onClick={this.updateDeal768.bind(this)} className="btn btn-primary btn-block btn-round">Cоздать сделку</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;