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
 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kontragents: [],
      duedate:'',
      rek: '',
      deal406: {
        seller: '',
        buyer: '',
        itemname: '',
        quantity: '',
        price: '',
        payday: '',
        getbackday:'',
        quality: '',
        description: '',
        state: '',
        expire: '',
        complexity: '',
        additional:''
      }
    }
    this.deal406=this.deal406.bind(this)
  }
  componentDidMount() { 
    swal("Cделка действительна только в случае купли-продажи движимого имущества. В ином случае необходимо заключить письменный договор и обратиться в Центр обслуживания населения по местонахождению недвижимого имущества для целей государственной регистрации такого договора.")
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
  deal406(event){
    const field = event.target.name;
    const deal406 = this.state.deal406;
    deal406[field] = event.target.value;
    if(field=='state' && deal406[field]=='Новое'){
      this.setState({
        rek:'1'
      }) 
    } else{
      this.setState({
        rek: ''
      })
    }
    //console.log(this.state.deal406, this.state.payday, this.state.getbackday, this.state.duedate)
    const formData = `deal406=${JSON.stringify(this.state.deal406)}&duedate=${this.state.duedate}`;
  }

 
  render() {

    console.log(this.state.deal406)
    return (

    <div className="col-md-6">
     <div className="form-group">
      <h3>Договор купли-продажи</h3>
      <h4><b className="cust_weigh">Предмет договора: </b> Продавец передает, а Покупатель обязуется принять товар (имущество), указанный в настоящем договоре, на условиях, предусмотренных настоящим договором.</h4>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Продавец</label>  

            {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="seller" onChange={this.deal406}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Покупатель</label>  
            {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" name="buyer" onChange={this.deal406}>
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
        <label className="form-control-label"  >Наименование (ассортимент) товара</label>
        <input onChange={this.deal406}  type="text" className="form-control"   name="itemname"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" >Количество товара</label>
        <input onChange={this.deal406}  type="text" className="form-control"   name="quantity"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Цена товара, тенге</label>
        <input onChange={this.deal406}  type="number" className="form-control"  name="price"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты товара</label>
            <input onChange={this.deal406}  type="text" className="form-control"  name="payday"   autoComplete="off" />

      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок передачи товара</label>
            <input onChange={this.deal406}  type="text" className="form-control"  name="getbackday"   autoComplete="off" />

    
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Качество товара</label>
        <input onChange={this.deal406}  type="text" className="form-control"   name="quality"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Характеристика товара</label>
        <input onChange={this.deal406}  type="text" className="form-control"   name="description"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Cостояние товара (б/у или новое)</label>
        <select className="form-control" name="state" onChange={this.deal406} >
         <option  value="">Выберите</option>
        <option value="Б/У">Б/У</option>
        <option value="Новое">Новое</option>
        </select>
      </div>
      {
        (this.state.rek=='1')?(
  <div className="form-group">
        <label className="form-control-label"  >Срок годности товара/гарантии (если применимо)</label>
        <input onChange={this.deal406}  type="text" className="form-control"   name="expire"  autoComplete="off" />
      </div>
          ):(
          <div></div>

          )
      }
    
      <div className="form-group">
        <label className="form-control-label"  >Комплектность товара (если применимо)</label>
        <input onChange={this.deal406}  type="text" className="form-control"   name="complexity"  autoComplete="off" />
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
        <input onChange={this.deal406}  type="text" className="form-control"   name="additional"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"><br/></label>
        <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>
 
                   );
  }
}export default Deals;