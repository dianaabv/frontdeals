// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' 
import Auth from '../modules/Auth';

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kontragents: [],
      duedate: '',
      deadline: '',

      deal501: {
        side1: '',
        side2: '',
        itemname1: '',
        quantity1: '',
        price1: '',
        quality1: '',
        description1: '',
        state1:'',
        itemname2: '',
        quantity2: '',
        price2: '',
        quality2: '',
        description2: '',
        state2: '',
        additional: ''
      }
    }
    this.deal501=this.deal501.bind(this);

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
  deal501(event){
    const field = event.target.name;
    const deal501 = this.state.deal501;
    deal501[field] = event.target.value;
    // console.log(this.state.deal501, this.state.duedate, this.state.deadline)
  }

  render() {
   
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор мены</h3>
      <h4>Предмет догвора: Одна сторона передает другой и получает взамен имущество на условиях, указанных в настоящем договоре</h4>
      </div>
   
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Сторона 1</label>  
        {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="side1" onChange={this.deal501}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Сторона 2</label>  
        {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="side2" onChange={this.deal501}>
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
        <label className="form-control-label" htmlFor="inputNameAddShop">Наименование имущества подлежащего передаче Стороной 1</label>
        <input onChange={this.deal501}  type="text" className="form-control"   name="itemname1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Количество товара, подлежащего передаче Стороной 1</label>
        <input onChange={this.deal501}  type="text" className="form-control"   name="quantity1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Стоимость имущества,  подлежащего передаче Стороной 1</label>
        <input onChange={this.deal501}  type="number" className="form-control"   name="price1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Качество имущества подлежащего передаче Стороной 1</label>
            <input onChange={this.deal501}  type="text" className="form-control"  name="quality1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Характеристика имущества подлежащего передаче Стороной 1</label>
            <input onChange={this.deal501} type="text" className="form-control"   name="description1"   autoComplete="off" />
      </div>
 
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Cостояние имущества подлежащего передаче Стороной 1</label>
        <select className="form-control" name="state1" onChange={this.deal501} >
          <option selected disabled>Выберите</option>
          <option value="Б/У">Б/У</option>
          <option value="Новое">Новое</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Наименование имущества, подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className="form-control"   name="itemname2"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Количество товара, подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className="form-control"   name="quantity2"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Стоимость имущества,  подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="number" className="form-control"  name="price2"   autoComplete="off" />
      </div>
       <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Качество  имущества подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501} type="text" className="form-control"   name="quality2"   autoComplete="off" />
      </div>
       <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Характеристика имущества подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className="form-control"   name="description2"   autoComplete="off" />
      </div>
       <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Cостояние имущества подлежащего передаче Стороной 2</label>
        <input onChange={this.deal501}  type="text" className="form-control"  name="state2"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="inputNameAddShop">Сроки и порядок обмена товарами</label>
        <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({deadline: jsDate})}
                                locale='ru'/>
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
        <input onChange={this.deal501}  type="text" className="form-control"   name="additional"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;