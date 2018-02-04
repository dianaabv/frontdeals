import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

import swal from 'sweetalert'
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import InputElement from 'react-input-mask';
import 'rc-datepicker/lib/style.css';
//import DatePicker from 'react-bootstrap-date-picker';

import 'moment/locale/ru.js' 

import { DatePicker, DatePickerInput } from 'rc-datepicker';
const date = '2015-06-26' 
class SignupBuyer extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state={
      birthday: "",
      message: '',
      issueddate: "",
      dateregip: "",
      pass_err: '',
      email_err: '',
      pass_check : '',
      email_check: '',
      person: {
        username: "",
        firstname: "",
        lastname: "",
        midname: "",
        email: "",
        password: "",
        password2: "",
        udv: "",
        issuedby: "",
        iin: "",
        address: "",
        nameip: "",
        noregip: "",
        addressregip: ""
      }
    };
   this.changePerson = this.changePerson.bind(this);
  }
  changePerson(event){
    const field = event.target.name;
    const person = this.state.person;
    person[field] = event.target.value;
    if(field =='password2'){
        if(this.state.person.password != this.state.person.password2){
            this.setState({
                pass_err: 'Пароли должны совпадать',
                pass_check: ''
            }) 
        }
        else{
            this.setState({
                pass_err: '',
                pass_check: 'true'
            }) 
                
        }
      
    }
    if(field== 'email'){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var test = re.test(this.state.person.email);
        if(!test) {
            this.setState({
                email_err: 'Неправильный формат почты. ',
                email_check: ''
            })
        } else{
            this.setState({
                email_err: '',
                email_check: 'true'
            })
        }
    }
    this.setState({
        person: person
    })
    }
    componentWillMount(){
        document.getElementById('root').className='animsition page-register-v2 layout-full page-dark';
    }
   
    submit(){
      console.log()
    if((this.state.person.firstname.length > 0 ) && (this.state.person.lastname.length>0) && (this.state.email_check.length>0) && (this.state.pass_check.length>0) && (this.state.person.username.length==18) && (this.state.birthday>0)&& (this.state.person.udv.length ==9) && (this.state.person.issuedby.length>0) 
     && (this.state.person.iin.length>11) && (this.state.person.address.length>0) && (this.state.person.nameip.length>0) && (this.state.person.noregip.length>0) && (this.state.person.addressregip.length>0) && (this.state.dateregip>0))
         
         {
              const formData = `person=${JSON.stringify(this.state.person)}&birthday=${this.state.birthday}&issueddate=${this.state.issueddate}&dateregip=${this.state.dateregip}`;

                 axios.post('http://185.100.67.106:4040/api/signupip',formData,{
         responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
      }

      }).then((res) => {
          if (res.data.message==='Вы зарегестрировались! Пройдите по ссылке'){
           setTimeout(function(){ 
            swal("Привет! Вы успешно прошли регистрацию и можете получить ваш пароль на вашем email. Это сделано с целью вашей безопасности. Вы можете поменять его в личном кабинете. Cпасибо").then(function(){
            browserHistory.push('/#/');
            window.location.reload();
            })         
        }, 1000);
          } else {
              this.setState({message: res.data.message});
              swal({title: "Упс!", text: this.state.message})
          }
        });  
         } else{
            swal("Проверьте поля")
         }
    }

  render() {
    const today=new Date();
    const yesterday = new Date();
    yesterday.setFullYear(yesterday.getFullYear() -18)   
    return (
          <div className="page col-md-4" data-animsition-in="fade-in" data-animsition-out="fade-out">
                <div className="page-content">
                    <div className="page-brand-info">
                        <div className="brand">
                            <img className="brand-img" src="../../assets/images/logo@2x.png" alt="..." />
                            <h2 className="brand-text font-size-40">Сделки LegCo</h2>
                        </div>
                        <p className="font-size-20">Цифровой способ заключения сделок</p>
                    </div>
                    <div className="page-register-main animation-slide-left animation-duration-1">
                       
                        <h3 className="font-size-24">Регистрация для ИП</h3>
                        <Link to="/signup" className="font-size-24">Зарегестрироваться как Физическое лицо</Link>

                        <p>Добро пожаловать</p>
                        <p>{this.state.message}</p>
                        <form >
                           <div className="form-group">
                            <InputElement mask="+7 (999) 999-99-99" required={true} className="form-control"
                             placeholder="Введите номер телефона"
                             name="username"
                             onChange={this.changePerson}
                             value={this.state.person.username} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} 
                                value={this.state.person.firstname}
                                type="text" className="form-control" id="inputFirstname" name="firstname"  placeholder="Имя"
                                Arial />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} 
                                value={this.state.person.lastname} type="text" className="form-control" id="inputLastname" name="lastname" placeholder="Фамилия" />
                            </div>
                            <div className="form-group">
                               
                                <input onChange={this.changePerson} 
                                value={this.state.person.midname} type="text" className="form-control" id="inputMidname" name="midname" placeholder="Отчество" />
                            </div>
                            <div className="form-group">
                               
                                <input onChange={this.changePerson} 
                                value={this.state.person.email} type="email" className="form-control" id="inputEmail" name="email" placeholder="Email" />
                                <p>{this.state.email_err}</p>
                            </div>
                                <div className="form-group">
                                <input onChange={this.changePerson}
                                value={this.state.person.password} type="password" className="form-control" 
                                name="password" id="password" name="password" placeholder="Пароль" />
                            </div>
                            <div className="form-group">
                               
                                <input onChange={this.changePerson}
                                value={this.state.person.password2} type="password" 
                                name="password2" className="form-control" id="password2" name="password2" placeholder="Повторный пароль" />
                                 <p>{this.state.pass_err}</p>
                            </div>
                            <div className="form-group">
                                   <DatePickerInput
                                   maxDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({birthday: jsDate})}
                                locale='ru'
                                placeholder="Дата Рождения"/>
                            </div>
                            <div className="form-group">
                                    <InputElement mask="999999999" className="form-control"
                                placeholder="№ Удостоверения личности" name="udv"
                                onChange={this.changePerson} value={this.state.person.udv} />
                            </div>
                            <div className="form-group">
                                  <select className="form-control" onChange={this.changePerson} name="issuedby" value={this.state.person.issuedby}>
                                  <option value="" >Орган, выдавший уд-ние личности</option>
                                    <option value="МВД РК" >МВД РК</option>
                                    <option value="Министерство юстиции Республики Казахстан">Министерство юстиции Республики Казахстан</option>
                                  </select>
                            </div>
                            <div className="form-group">
                                <DatePickerInput
                                maxDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({issueddate: jsDate})}
                                locale='ru'
                                placeholder="Дата выдачи уд-ния личности"/>
                            </div>
                            <div className="form-group">
                                <InputElement mask="999999999999" className="form-control"
                                placeholder="ИИН" name="iin"
                                onChange={this.changePerson} value={this.state.person.iin} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} value={this.state.person.address} type="text"
                                 className="form-control" id="inputLastname" name="address" placeholder="Адрес регистрации" />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} value={this.state.person.nameip} type="text"
                                 className="form-control" id="inputLastname" name="nameip" placeholder="Наименование ИП" />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} value={this.state.person.noregip} type="text"
                                 className="form-control" id="inputLastname" name="noregip" placeholder="Номер свидетельства о гос. регистрации ИП" />
                            </div>
                            <div className="form-group">
                                <DatePickerInput
                                maxDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({dateregip: jsDate})}
                                locale='ru'
                                placeholder="Дата гос. регистрации ИП"/>
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} value={this.state.person.addressregip} type="text"
                                 className="form-control" id="inputLastname" name="addressregip" placeholder="Адрес регистрации в качестве ИП" />
                            </div>

                            <div className="form-group clearfix">
                                <div className="checkbox-custom checkbox-inline checkbox-primary float-left">
                                    <input type="checkbox" id="inputCheckbox" name="term" />
                                    <label htmlFor="inputCheckbox" />
                                </div>
                                <p className="ml-40">Регистрируясь, вы принимаете наши </p>
                            </div>
                            <button type="button" onClick={this.submit.bind(this)} className="btn btn-primary btn-block">Регистрация</button>
                        </form>
                     
                        <p>У вас уже есть аккаунт? Пожалуйста,<Link to="/signin" className="waves-effect"  >войдите</Link></p>
                        <footer className="page-copyright">
                            <p>Сделки LegCo</p>
                            <p>2018. ©  Все права защищены.</p>
                            <div className="social">
                                <a className="btn btn-icon btn-round social-twitter mx-5" href="javascript:void(0)">
                                    <i className="icon bd-twitter" aria-hidden="true" />
                                </a>
                                <a className="btn btn-icon btn-round social-facebook mx-5" href="javascript:void(0)">
                                    <i className="icon bd-facebook" aria-hidden="true" />
                                </a>
                                <a className="btn btn-icon btn-round social-google-plus mx-5" href="javascript:void(0)">
                                    <i className="icon bd-google-plus" aria-hidden="true" />
                                </a>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
   );
  }
}

// SignupBuyer.propTypes = {
//   router: PropTypes.string.isRequired
// };

export default SignupBuyer;
