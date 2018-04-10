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
      },
      duedate_err: '',
      message: '',
      lawid: '406',
      status1: '',
      status: 'Физическое лицо',
      valid_err: [],
      goreceiver: '',
      role: '',
    }
    this.deal406=this.deal406.bind(this)
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
    updateDeal(event){
      var dealz = {
        seller: this.state.deal406.seller,
        buyer: this.state.deal406.buyer,
        itemname: this.state.deal406.itemname,
        quantity: this.state.deal406.quantity,
        price: this.state.deal406.price,
        payday: this.state.deal406.payday,
        getbackday:this.state.deal406.getbackday,
        quality: this.state.deal406.quality,
        description: this.state.deal406.description,
        state: this.state.deal406.state
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
       if(valid_err.length == 0 && this.state.duedate_err!='1'){
         const formData = `deal406=${JSON.stringify(this.state.deal406)}&seller=${this.state.deal406.seller}&buyer=${this.state.deal406.buyer}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}`;
         axios.post('http://185.100.67.106:4040/create/createdeal406',formData,{
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
  updateRole(event){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    if(event.target.value=='seller'){
    if(this.state.deal406.buyer.length == 0){
      this.state.deal406['buyer']=''
    } else{
      this.state.deal406['buyer']=this.state.deal406.seller
    }
    this.state.deal406['seller']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='buyer'){

      if(this.state.deal406.seller ==0){
        this.state.deal406['seller']=''
      } else{
        this.state.deal406['seller']=this.state.deal406.buyer
      }
      this.state.deal406['buyer']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal406['buyer']=''
      this.state.deal406['seller']=''
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
      <h3>Договор купли-продажи</h3>
      <h4><b className="cust_weigh">Предмет договора: </b> Продавец передает, а Покупатель обязуется принять товар (имущество), указанный в настоящем договоре, на условиях, предусмотренных настоящим договором.</h4>
      </div>
      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="seller">Продавцом</option>
        <option value="buyer">Покупателем</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
        <div className="form-group">
          <label className="form-control-label" htmlFor="citySelectorAddShopForm">Покупатель</label>
              {
                                                      this.state.kontragents.length!=0 ?
                                                      (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("buyer")  ? 'input_err' : '')} name="buyer" onChange={this.deal406}>
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
            <label className="form-control-label" htmlFor="citySelectorAddShopForm">Продавец</label>

                {
                                                        this.state.kontragents.length!=0 ?
                                                        (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("seller")  ? 'input_err' : '')} name="seller" onChange={this.deal406}>
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
        <label className="form-control-label"  >Наименование (ассортимент) товара</label>
        <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("itemname")  ? 'input_err' : '')}   name="itemname"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label" >Количество товара</label>
        <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("quantity")  ? 'input_err' : '')}   name="quantity"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Цена товара, тенге</label>
        <input onChange={this.deal406}  type="number" className={"form-control " + (this.state.valid_err.includes("price")  ? 'input_err' : '')}  name="price"   autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок оплаты товара</label>
            <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("payday")  ? 'input_err' : '')}  name="payday"   autoComplete="off" />

      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок передачи товара</label>
            <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("getbackday")  ? 'input_err' : '')}  name="getbackday"   autoComplete="off" />


      </div>
      <div className="form-group">
        <label className="form-control-label"  >Качество товара</label>
        <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("quality")  ? 'input_err' : '')}   name="quality"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Характеристика товара</label>
        <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("description")  ? 'input_err' : '')}   name="description"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Cостояние товара (б/у или новое)</label>
        <select className={"form-control " + (this.state.valid_err.includes("state")  ? 'input_err' : '')} name="state" onChange={this.deal406} >
         <option  value="">Выберите</option>
        <option value="Б/У">Б/У</option>
        <option value="Новое">Новое</option>
        </select>
      </div>
      {
        (this.state.rek=='1')?(
  <div className="form-group">
        <label className="form-control-label"  >Срок годности товара/гарантии (если применимо)</label>
        <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("expire")  ? 'input_err' : '')}   name="expire"  autoComplete="off" />
      </div>
          ):(
          <div></div>

          )
      }

      <div className="form-group">
        <label className="form-control-label"  >Комплектность товара (если применимо)</label>
        <input onChange={this.deal406}  type="text" className={"form-control " + (this.state.valid_err.includes("complexity")  ? 'input_err' : '')}   name="complexity"  autoComplete="off" />
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
        <input onChange={this.deal406}  type="text" className="form-control "    name="additional"  autoComplete="off" />
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
        <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
      </div>
    </div>

                   );
  }
}export default Deals;
