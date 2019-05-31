// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import InputElement from 'react-input-mask';
import Auth from '../modules/Auth'
import jwtDecode from 'jwt-decode';
import './style.css';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import swal from 'sweetalert'
 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      endpoint: "https://sdelkibackend.herokuapp.com",
      kontragents: [],
      duedate: '',
      //deadline: '',
      goreceiver: '',
      lawid: '506',
      role: '',
      deal506:{
        presenter:'',
        receiver: '',
        itemname: '',
        quantity: '',
        additional: '',
        deadline: ''
      },
      duedate_err: '',
      deadline: '',
      message: '',
      checkContent: false,
      lawid: '506',
      status1: '',
      status: 'Физическое лицо',
      valid_err: []
    }
    this.deal506=this.deal506.bind(this)
    this.updateDeal=this.updateDeal.bind(this)
    this.updateRole=this.updateRole.bind(this)

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
  //  swal("Cделка действительна только в случае дарения движимого имущества. В ином случае необходимо заключить письменный договор и обратиться в Центр обслуживания населения по местонахождению недвижимого имущества для целей государственной регистрации такого договора.")
      axios.get('https://sdelkibackend.herokuapp.com/api/getmykontragents',{
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
//console.log(this.state.deal506.presenter.length,'p',this.state.deal506.receiver.length,'r',this.state.deal506.itemname,'i',this.state.deal506.quantity.length,'q',this.state.deal506.additional.length,'a',String(this.state.duedate).length,'du',String(this.state.deadline).length,'ded')
    if((this.state.deal506.presenter.length>0)&&(this.state.deal506.receiver.length>0)&&(this.state.deal506.itemname.length>0)&& (this.state.deal506.quantity.length>0)&&(String(this.state.duedate).length>0) && (String(this.state.deadline).length>0)){
      this.setState({
        checkContent: true
      })
    }else {
          this.setState({
            checkContent: false
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
    if(this.state.deal506.receiver.length == 0){
      this.state.deal506['receiver']=''
    } else{
      this.state.deal506['receiver']=this.state.deal506.presenter
    }
    this.state.deal506['presenter']=decoded.sub
    this.setState({
      role:event.target.value,
      goreceiver: 'ok'
    })
    }
    if(event.target.value=='Одаряемый'){

      if(this.state.deal506.presenter==0){
        this.state.deal506['presenter']=''
      } else{
        this.state.deal506['presenter']=this.state.deal506.receiver
      }
      this.state.deal506['receiver']=decoded.sub
      this.setState({
        goreceiver: 'neok',
        role:event.target.value
      })
    }
    if(event.target.value=='0'){
      this.state.deal506['receiver']=''
      this.state.deal506['presenter']=''
      this.setState({
        goreceiver: '',
        role:'',
        checkContent: false
      })
    }
  }
  updateDeal(event){
     var deal506_z = {
        presenter: this.state.deal506.presenter,
        receiver: this.state.deal506.receiver,
        itemname: this.state.deal506.itemname,
        quantity: this.state.deal506.quantity,
        deadline: this.state.deal506.deadline
      }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(deal506_z)
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
        const formData = `deal506=${JSON.stringify(this.state.deal506)}&presenter=${this.state.deal506.presenter}&receiver=${this.state.deal506.receiver}&duedate=${this.state.duedate}&lawid=${this.state.lawid}&status=${this.state.status}`;
        axios.post('https://sdelkibackend.herokuapp.com/create/createdeal506',formData,{
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


  render() {
  const today=new Date();
  today.setDate(today.getDate() + 1)
    return (

    <div className="col-md-6">
      <div className="form-group">
        <h3>Договор дарения</h3>
        <h4><b className="cust_weigh">Предмет договора: </b> Даритель обязуется передать Одаряемому вещь в собственность либо имущественное право (требование) к себе или третьему лицу, либо освобождает или обязуется освободить ее от имущественной обязанности перед третьим лицом на условиях, указанных в настоящем договоре.</h4>
        <h4><b className="cust_weigh">Внимание: </b> при выборе недвижимого имущества (дом, квартира, офис, помещение и т.д.) сделка должна быть выполнена в письменном виде и зарегистрирована в установленном законодательством порядке</h4>

      </div>


      <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm" >Я являюсь</label>
        <select className="form-control" name="role" onChange={this.updateRole}>
         <option value='0' >Выберите</option>
        <option value="Даритель">Дарителем</option>
        <option value="Одаряемый">Одаряемым</option>
        </select>
      </div>
      {(this.state.goreceiver=='ok')?(
            <div className="form-group">
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Одаряемый </label> <br/ >
         {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("receiver")  ? 'input_err' : '')} name="receiver"  onChange={this.deal506}>
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
        <label className="form-control-label" htmlFor="citySelectorAddShopForm">Даритель </label> <br/ >
         {
                                                    this.state.kontragents.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className={"form-control " + (this.state.valid_err.includes("presenter")  ? 'input_err' : '')} name="presenter"  onChange={this.deal506}>
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
        <label className="form-control-label"  >Наименование дара (вещи или имущественного права (требование) либо освобождения от имущественной обязанности)</label>
        <input onChange={this.deal506}  type="text" className={"form-control " + (this.state.valid_err.includes("itemname")  ? 'input_err' : '')}  name="itemname"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Количество дара</label>
        <input onChange={this.deal506}  type="text" className={"form-control " + (this.state.valid_err.includes("quantity")  ? 'input_err' : '')}  name="quantity"  autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-control-label"  >Сроки и порядок передачи дара(момент перехода права собственности)</label>
            <input onChange={this.deal506}  type="text" className={"form-control " + (this.state.valid_err.includes("deadline")  ? 'input_err' : '')}  name="deadline"  autoComplete="off" />

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
        <input onChange={this.deal506}  type="text" className="form-control " name="additional"  autoComplete="off" />
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
