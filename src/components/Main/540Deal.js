// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' 
import Auth from '../modules/Auth';
import swal from 'sweetalert'

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kontragents: [],
      // deadline: '',
      // payday: '',
      duedate: '',
      deal540: {
        employer: '',
        employee: '',
        itemdata: '',
        keepcondition: '',
        usecondition: '',
        additional: '',
        payday: '',
        deadline: ''
      }
    }
    this.deal540=this.deal540.bind(this)
  }
  componentDidMount() {
    swal("Cделка будет недействительной в случае найма недвижимого имущества на срок от одного года и более. В таком случае необходимо заключить письменный договор и обратиться в Центр обслуживания населения по местонахождению недвижимого имущества для целей государственной регистрации такого договора.")
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


  render() {
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор имущественного найма (аренды)</h3>
      <h4><b className="cust_weigh">Предмет договора: </b> Наймодатель предоставляет нанимателю имущество за плату во временное владение и пользование на условиях, указанных в настоящем договоре. Внимание: при выборе недвижимого имущества срок договора должен составлять менее года, иначе сделка должна быть выполнена в письменном виде и зарегистрирована в установленном законодательством порядке</h4>
      </div>
   
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Наймодатель</label>  
        {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="employer" onChange={this.deal540}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Наниматель</label>  
         {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="employee" onChange={this.deal540}>
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
        <label className="form-control-label"  >Данные, позволяющие установить имущество, подлежащее передаче в аренду</label>
        <input onChange={this.deal540} type="text" className="form-control"  name="itemdata"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Cроки и порядок передачи/возврата имущества</label>
          <input onChange={this.deal540} type="text" className="form-control"  name="deadline"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты</label>
                <input onChange={this.deal540} type="text" className="form-control"  name="payday"   autoComplete="off" />

           
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Условия о содержании/улучшении имущества</label>
        <input onChange={this.deal540}  type="text" className="form-control"   name="keepcondition"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Условия об использовании имущества (в т.ч. пределах распоряжения)</label>
        <input onChange={this.deal540} type="text" className="form-control"   name="usecondition"   autoComplete="off" />
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
        <input onChange={this.deal540} type="text" className="form-control"   name="additional"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;