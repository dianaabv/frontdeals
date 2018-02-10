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
      message: '',
      pass_err: '',
      email_err: '',
      udv_err: '',
      iin_err: '',
      username_err:'',
      midname: '',
      person: {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password2: "",
        udv: "",
        issuedby: "",
        iin: "",
        address: "",
        nameip: "",
        noregip: "",
        addressregip: "",
        dob_month: '',
        dob_day: '',
        dob_year: '',
        issueddate_day: '',
        issueddate_month: '',
        issueddate_year: '',
        dateregip_day: '',
        dateregip_month: '',
        dateregip_year: '',
      },
      isChecked: false,
      valid_err: []
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
                pass_err: 'Пароли должны совпадать'
            }) 
        }
        else{
            this.setState({
                pass_err: ''
            }) 
                
        }
      
    }
    if(field== 'email'){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var test = re.test(this.state.person.email);
        if(!test) {
            this.setState({
                email_err: 'Неправильный формат почты. ',
            })
        } else{
            this.setState({
                email_err: ''
            })
        }
    }
    this.setState({
        person: person
    })
    }
    componentWillMount(){
        document.getElementById('root').className='animsition page-register-v2 layout-full';
    }
   
    submit(){
        var person1 =  {
             username: this.state.person.username,
              firstname: this.state.person.firstname,
              lastname: this.state.person.lastname,
              email: this.state.person.email,
              password: this.state.person.password,
              password2: this.state.person.password2,
              udv: this.state.person.udv,
              issuedby:this.state.person.issuedby,
              iin: this.state.person.iin,
              address: this.state.person.address,
              dob_day: this.state.person.dob_day,
              dob_month: this.state.person.dob_month,
              dob_year: this.state.person.dob_year,
              issueddate_day: this.state.person.issueddate_day,
              issueddate_month: this.state.person.issueddate_month,
              issueddate_year: this.state.person.issueddate_year,
              dateregip_day: this.state.person.dateregip_day,
              dateregip_month: this.state.person.dateregip_month,
              dateregip_year: this.state.person.dateregip_year,
              nameip: this.state.person.nameip,
              noregip: this.state.person.noregip,
              addressregip: this.state.person.addressregip,
        }
              const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(person1)
      var valid_err = Object.keys(mainobj)
      this.setState({
        valid_err: valid_err
      })
      if(this.state.person.udv.indexOf('_')!=-1){
        this.setState({
          udv_err: '№ Удостоверения личности должен состоять из 9 цифр'
        })
      } else{
          this.setState({
            udv_err: ''
          })
      }
      if(this.state.person.iin.indexOf('_')!=-1){
        this.setState({
          iin_err: 'ИИН должен состоять из 12 цифр'
        })
      } else {
        this.setState({
          iin_err: ''
        })
      }
      if(this.state.person.username.indexOf('_')!=-1){
        this.setState({
          username_err: 'Сотовый телефон должен состоять из 10 цифр'
        })
      } else{
        this.setState({
          username_err: ''
        })
      }
      if(this.state.isChecked!=1){
        swal("Вы не приняли пользовательское соглашение.")
      } else {
            if((this.state.valid_err.length==0)&& (this.state.pass_err.length ==0) && (this.state.email_err.length ==0) && (this.state.udv_err.length ==0) && (this.state.iin_err.length ==0)  && (this.state.username_err.length ==0) )
         
         {
         
              const formData = `person=${JSON.stringify(this.state.person)}&midname=${this.state.midname}`;
              

                 axios.post('http://185.100.67.106:4040/api/signupip',formData,{
         responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
      }

      }).then((res) => {
          if (res.data.message==='Вы зарегестрировались! Пройдите по ссылке'){
           setTimeout(function(){ 
            swal("Поздравляем! Вы успешно прошли регистрацию.").then(function(){
            browserHistory.push('/signin');
            window.location.reload();
            })         
        }, 1000);
          } else {
              this.setState({message: res.data.message});
              swal({text: this.state.message})
          }
        });  
         } else{
            swal("Проверьте поля")
         }

      }
    }
        toggleAgree(){
      this.setState({
        isChecked: !this.state.isChecked,
      });
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
                            {/*<img className="brand-img" src="../../assets/images/logo@2x.png" alt="..." />*/}
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
                            <InputElement mask="+7 (999) 999-99-99" className={"form-control " + ((this.state.valid_err.includes("username") || this.state.username_err.length!=0)  ? ('input_err' ): (''))}
                             placeholder="Введите номер телефона"
                             name="username"
                             onChange={this.changePerson}
                             value={this.state.person.username} />
                             <p className="err_red">{this.state.username_err}</p>
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} 
                                
                                type="text" className={"form-control " + (this.state.valid_err.includes("firstname")  ? 'input_err' : '')}id="inputFirstname" name="firstname"  placeholder="Имя"
                                 />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} 
                                type="text"  className={"form-control " + (this.state.valid_err.includes("lastname")  ? 'input_err' : '')} id="inputLastname" name="lastname" placeholder="Фамилия" />
                            </div>
                            <div className="form-group">
                               
                                <input onChange={(event)=>{this.setState({midname: event.target.value}) }}
                                 type="text" className="form-control" id="inputMidname" name="midname" placeholder="Отчество" />
                            </div>
                            <div className="form-group">
                               
                                <input onChange={this.changePerson} 
                                value={this.state.person.email} type="email" className={"form-control " + ((this.state.email_err.length !=0 || this.state.valid_err.includes("email") )  ? ('input_err') : (''))} id="inputEmail" name="email" placeholder="Email" />
                                <p>{this.state.email_err}</p>
                            </div>
                                <div className="form-group">
                                <input onChange={this.changePerson}
                                 type="password"  className={"form-control " + ((this.state.pass_err.length !=0 || this.state.valid_err.includes("password")) ? ('input_err' ): (''))}                                 name="password" id="password" name="password" placeholder="Пароль" />
                            </div>
                            <div className="form-group">
                               
                                <input onChange={this.changePerson}
                                type="password" 
                                name="password2" className="form-control "  id="password2" name="password2" placeholder="Повторный пароль" />
                                 <p>{this.state.pass_err}</p>
                            </div>
                            <div className="form-group">
                              <h4 >Дата рождения</h4>  
                            <div className="row">
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dob_day")) ? ('input_err') : (''))} onChange={this.changePerson} name="dob_day" >
                                    <option value='' >День</option>
<option value="01">1</option>
<option value="02">2</option>
<option value="03">3</option>
<option value="04">4</option>
<option value="05">5</option>
<option value="06">6</option>
<option value="07">7</option>
<option value="08">8</option>
<option value="09">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
<option value="24">24</option>
<option value="25">25</option>
<option value="26">26</option>
<option value="27">27</option>
<option value="28">28</option>
<option value="29">29</option>
<option value="30">30</option>
<option value="31">31</option>

                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dob_month")) ? ('input_err') : (''))}  onChange={this.changePerson} name="dob_month"  >
                                    <option  value=''>Месяц</option>
<option value="01">Январь</option>
<option value="02">Февраль</option>
<option value="03">Март</option>
<option value="04">Апрель</option>
<option value="05">Май</option>
<option value="06">Июнь</option>
<option value="07">Июль</option>
<option value="08">Август</option>
<option value="09">Сентябрь</option>
<option value="10">Октябрь</option>
<option value="11">Ноябрь</option>
<option value="12">Декабрь</option>
                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dob_year")) ? ('input_err') : (''))}  onChange={this.changePerson} name="dob_year" >
                                    <option value=''  >Год</option>
                                    <option value="2004">2004</option>
<option value="2003">2003</option>
<option value="2002">2002</option>
<option value="2001">2001</option>
<option value="2000">2000</option>
<option value="1999">1999</option>
<option value="1998">1998</option>
<option value="1997">1997</option>
<option value="1996">1996</option>
<option value="1995">1995</option>
<option value="1994">1994</option>
<option value="1993">1993</option>
<option value="1992">1992</option>
<option value="1991">1991</option>
<option value="1990">1990</option>
<option value="1989">1989</option>
<option value="1988">1988</option>
<option value="1987">1987</option>
<option value="1986">1986</option>
<option value="1985">1985</option>
<option value="1984">1984</option>
<option value="1983">1983</option>
<option value="1982">1982</option>
<option value="1981">1981</option>
<option value="1980">1980</option>
<option value="1979">1979</option>
<option value="1978">1978</option>
<option value="1977">1977</option>
<option value="1976">1976</option>
<option value="1975">1975</option>
<option value="1974">1974</option>
<option value="1973">1973</option>
<option value="1972">1972</option>
<option value="1971">1971</option>
<option value="1970">1970</option>
<option value="1969">1969</option>
<option value="1968">1968</option>
<option value="1967">1967</option>
<option value="1966">1966</option>
<option value="1965">1965</option>
<option value="1964">1964</option>
<option value="1963">1963</option>
<option value="1962">1962</option>
<option value="1961">1961</option>
<option value="1960">1960</option>
<option value="1959">1959</option>
<option value="1958">1958</option>
<option value="1957">1957</option>
<option value="1956">1956</option>
<option value="1955">1955</option>
<option value="1954">1954</option>
<option value="1953">1953</option>
<option value="1952">1952</option>
<option value="1951">1951</option>
<option value="1950">1950</option>
<option value="1949">1949</option>
<option value="1948">1948</option>
<option value="1947">1947</option>
<option value="1946">1946</option>
<option value="1945">1945</option>
<option value="1944">1944</option>
<option value="1943">1943</option>
<option value="1942">1942</option>
<option value="1941">1941</option>
<option value="1940">1940</option>
<option value="1939">1939</option>
<option value="1938">1938</option>
<option value="1937">1937</option>
<option value="1936">1936</option>
<option value="1935">1935</option>
<option value="1934">1934</option>
<option value="1933">1933</option>
<option value="1932">1932</option>
<option value="1931">1931</option>
<option value="1930">1930</option>
<option value="1929">1929</option>
<option value="1928">1928</option>
<option value="1927">1927</option>
<option value="1926">1926</option>
<option value="1925">1925</option>
<option value="1924">1924</option>
<option value="1923">1923</option>
<option value="1922">1922</option>
<option value="1921">1921</option>
<option value="1920">1920</option>
<option value="1919">1919</option>
<option value="1918">1918</option>
<option value="1917">1917</option>
<option value="1916">1916</option>
<option value="1915">1915</option>
<option value="1914">1914</option>
<option value="1913">1913</option>
<option value="1912">1912</option>
<option value="1911">1911</option>
<option value="1910">1910</option>
<option value="1909">1909</option>
<option value="1908">1908</option>
<option value="1907">1907</option>
<option value="1906">1906</option>
<option value="1905">1905</option>
<option value="1904">1904</option>
<option value="1903">1903</option>
<option value="1902">1902</option>
<option value="1901">1901</option>

                                  </select>
                                </div>
                            </div>
                                {/*   <DatePickerInput
                                                                   maxDate={today}
                                                                className='my-react-datepicker'
                                                                value={this.state.value}
                                                                onChange={(jsDate) => this.setState({birthday: jsDate})}
                                                                locale='ru'
                                                                placeholder="Дата Рождения"/>*/}
                            </div>
                            <div className="form-group">
                                    <InputElement mask="999999999" className={"form-control " + ((this.state.valid_err.includes("udv") || this.state.udv_err.length !=0)  ? ('input_err') : (''))} 
                                placeholder="№ Удостоверения личности" name="udv"
                                onChange={this.changePerson}  />
                                 <p className="err_red">{this.state.udv_err}</p>
                            </div>
                            <div className="form-group">
                                  <select className={"form-control " + (this.state.valid_err.includes("issuedby")  ? 'input_err' : '')} onChange={this.changePerson} name="issuedby" value={this.state.person.issuedby}>
                                  <option value="" >Орган, выдавший уд-ние личности</option>
                                    <option value="МВД РК" >МВД РК</option>
                                    <option value="Министерство юстиции Республики Казахстан">Министерство юстиции Республики Казахстан</option>
                                  </select>
                            </div>
                            <div className="form-group">
                            <h4>Дата выдачи уд-ния личности</h4>  
                            <div className="row">
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("issueddate_day")) ? ('input_err') : (''))}  onChange={this.changePerson} name="issueddate_day"  >
                                    <option value='' >День</option>
<option value="01">1</option>
<option value="02">2</option>
<option value="03">3</option>
<option value="04">4</option>
<option value="05">5</option>
<option value="06">6</option>
<option value="07">7</option>
<option value="08">8</option>
<option value="09">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
<option value="24">24</option>
<option value="25">25</option>
<option value="26">26</option>
<option value="27">27</option>
<option value="28">28</option>
<option value="29">29</option>
<option value="30">30</option>
<option value="31">31</option>

                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("issueddate_month")) ? ('input_err') : (''))}  onChange={this.changePerson} name="issueddate_month"  >
                                    <option value='' >Месяц</option>
<option value="01">Январь</option>
<option value="02">Февраль</option>
<option value="03">Март</option>
<option value="04">Апрель</option>
<option value="05">Май</option>
<option value="06">Июнь</option>
<option value="07">Июль</option>
<option value="08">Август</option>
<option value="09">Сентябрь</option>
<option value="10">Октябрь</option>
<option value="11">Ноябрь</option>
<option value="12">Декабрь</option>
                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("issueddate_year")) ? ('input_err') : (''))}  onChange={this.changePerson} name="issueddate_year"  >
                                    <option value='' >Год</option>
                                             <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                     <option value="2012">2012</option>
                                      <option value="2011">2011</option>
                                       <option value="2010">2010</option>
                                     <option value="2009">2009</option>
                                    <option value="2008">2008</option>
                                    <option value="2007">2007</option>
                                    <option value="2006">2006</option>
                                    <option value="2005">2005</option>
                                    <option value="2004">2004</option>
<option value="2003">2003</option>
<option value="2002">2002</option>
<option value="2001">2001</option>
<option value="2000">2000</option>
<option value="1999">1999</option>
<option value="1998">1998</option>
<option value="1997">1997</option>
<option value="1996">1996</option>
<option value="1995">1995</option>
<option value="1994">1994</option>
<option value="1993">1993</option>
<option value="1992">1992</option>
<option value="1991">1991</option>
<option value="1990">1990</option>
<option value="1989">1989</option>
<option value="1988">1988</option>
<option value="1987">1987</option>
<option value="1986">1986</option>
<option value="1985">1985</option>
<option value="1984">1984</option>
<option value="1983">1983</option>
<option value="1982">1982</option>
<option value="1981">1981</option>
<option value="1980">1980</option>
<option value="1979">1979</option>
<option value="1978">1978</option>
<option value="1977">1977</option>
<option value="1976">1976</option>
<option value="1975">1975</option>
<option value="1974">1974</option>
<option value="1973">1973</option>
<option value="1972">1972</option>
<option value="1971">1971</option>
<option value="1970">1970</option>
<option value="1969">1969</option>
<option value="1968">1968</option>
<option value="1967">1967</option>
<option value="1966">1966</option>
<option value="1965">1965</option>
<option value="1964">1964</option>
<option value="1963">1963</option>
<option value="1962">1962</option>
<option value="1961">1961</option>
<option value="1960">1960</option>
<option value="1959">1959</option>
<option value="1958">1958</option>
<option value="1957">1957</option>
<option value="1956">1956</option>
<option value="1955">1955</option>
<option value="1954">1954</option>
<option value="1953">1953</option>
<option value="1952">1952</option>
<option value="1951">1951</option>
<option value="1950">1950</option>
<option value="1949">1949</option>
<option value="1948">1948</option>
<option value="1947">1947</option>
<option value="1946">1946</option>
<option value="1945">1945</option>
<option value="1944">1944</option>
<option value="1943">1943</option>
<option value="1942">1942</option>
<option value="1941">1941</option>
<option value="1940">1940</option>
<option value="1939">1939</option>
<option value="1938">1938</option>
<option value="1937">1937</option>
<option value="1936">1936</option>
<option value="1935">1935</option>
<option value="1934">1934</option>
<option value="1933">1933</option>
<option value="1932">1932</option>
<option value="1931">1931</option>
<option value="1930">1930</option>
<option value="1929">1929</option>
<option value="1928">1928</option>
<option value="1927">1927</option>
<option value="1926">1926</option>
<option value="1925">1925</option>
<option value="1924">1924</option>
<option value="1923">1923</option>
<option value="1922">1922</option>
<option value="1921">1921</option>
<option value="1920">1920</option>
<option value="1919">1919</option>
<option value="1918">1918</option>
<option value="1917">1917</option>
<option value="1916">1916</option>
<option value="1915">1915</option>
<option value="1914">1914</option>
<option value="1913">1913</option>
<option value="1912">1912</option>
<option value="1911">1911</option>
<option value="1910">1910</option>
<option value="1909">1909</option>
<option value="1908">1908</option>
<option value="1907">1907</option>
<option value="1906">1906</option>
<option value="1905">1905</option>
<option value="1904">1904</option>
<option value="1903">1903</option>
<option value="1902">1902</option>
<option value="1901">1901</option>

                                  </select>
                                </div>
                            </div>
                              {/*<DatePickerInput
                                                            maxDate={today}
                                                            className='my-react-datepicker'
                                                            value={this.state.value}
                                                            onChange={(jsDate) => this.setState({issueddate: jsDate})}
                                                            locale='ru'
                                                            placeholder="Дата выдачи уд-ния личности"/>*/}
                            </div>
                            <div className="form-group">
                                <InputElement mask="999999999999" className={"form-control " + ((this.state.valid_err.includes("iin") ||this.state.iin_err.length!=0 ) ? ('input_err' ): (''))} 
                                placeholder="ИИН" name="iin"
                                onChange={this.changePerson}  />
                                 <p className="err_red">{this.state.iin_err}</p>
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson}  type="text"
                                 className={"form-control " + (this.state.valid_err.includes("address")  ? 'input_err' : '')}id="inputLastname" name="address" placeholder="Адрес регистрации" />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson}  type="text"
                                  className={"form-control " + (( this.state.valid_err.includes("nameip")) ? ('input_err') : (''))} id="inputLastname" name="nameip" placeholder="Наименование ИП" />
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson}  type="number"
                                className={"form-control " + (( this.state.valid_err.includes("noregip")) ? ('input_err') : (''))}  id="inputLastname" name="noregip" placeholder="Номер свидетельства о гос. регистрации ИП" />
                            </div>
                            <div className="form-group">
                      <h4>Дата гос. регистрации ИП</h4>  
                            <div className="row">
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dateregip_day")) ? ('input_err') : (''))} onChange={this.changePerson} name="dateregip_day" >
                                    <option value='' >День</option>
<option value="01">1</option>
<option value="02">2</option>
<option value="03">3</option>
<option value="04">4</option>
<option value="05">5</option>
<option value="06">6</option>
<option value="07">7</option>
<option value="08">8</option>
<option value="09">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
<option value="24">24</option>
<option value="25">25</option>
<option value="26">26</option>
<option value="27">27</option>
<option value="28">28</option>
<option value="29">29</option>
<option value="30">30</option>
<option value="31">31</option>

                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dateregip_month")) ? ('input_err') : (''))}  onChange={this.changePerson} name="dateregip_month"  >
                                    <option  value=''>Месяц</option>
<option value="01">Январь</option>
<option value="02">Февраль</option>
<option value="03">Март</option>
<option value="04">Апрель</option>
<option value="05">Май</option>
<option value="06">Июнь</option>
<option value="07">Июль</option>
<option value="08">Август</option>
<option value="09">Сентябрь</option>
<option value="10">Октябрь</option>
<option value="11">Ноябрь</option>
<option value="12">Декабрь</option>
                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dateregip_year")) ? ('input_err') : (''))}  onChange={this.changePerson} name="dateregip_year" >
                                    <option value=''  >Год</option>
                                             <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                     <option value="2012">2012</option>
                                      <option value="2011">2011</option>
                                       <option value="2010">2010</option>
                                     <option value="2009">2009</option>
                                    <option value="2008">2008</option>
                                    <option value="2007">2007</option>
                                    <option value="2006">2006</option>
                                    <option value="2005">2005</option>
                                    <option value="2004">2004</option>
<option value="2003">2003</option>
<option value="2002">2002</option>
<option value="2001">2001</option>
<option value="2000">2000</option>
<option value="1999">1999</option>
<option value="1998">1998</option>
<option value="1997">1997</option>
<option value="1996">1996</option>
<option value="1995">1995</option>
<option value="1994">1994</option>
<option value="1993">1993</option>
<option value="1992">1992</option>
<option value="1991">1991</option>
<option value="1990">1990</option>
<option value="1989">1989</option>
<option value="1988">1988</option>
<option value="1987">1987</option>
<option value="1986">1986</option>
<option value="1985">1985</option>
<option value="1984">1984</option>
<option value="1983">1983</option>
<option value="1982">1982</option>
<option value="1981">1981</option>
<option value="1980">1980</option>
<option value="1979">1979</option>
<option value="1978">1978</option>
<option value="1977">1977</option>
<option value="1976">1976</option>
<option value="1975">1975</option>
<option value="1974">1974</option>
<option value="1973">1973</option>
<option value="1972">1972</option>
<option value="1971">1971</option>
<option value="1970">1970</option>
<option value="1969">1969</option>
<option value="1968">1968</option>
<option value="1967">1967</option>
<option value="1966">1966</option>
<option value="1965">1965</option>
<option value="1964">1964</option>
<option value="1963">1963</option>
<option value="1962">1962</option>
<option value="1961">1961</option>
<option value="1960">1960</option>
<option value="1959">1959</option>
<option value="1958">1958</option>
<option value="1957">1957</option>
<option value="1956">1956</option>
<option value="1955">1955</option>
<option value="1954">1954</option>
<option value="1953">1953</option>
<option value="1952">1952</option>
<option value="1951">1951</option>
<option value="1950">1950</option>
<option value="1949">1949</option>
<option value="1948">1948</option>
<option value="1947">1947</option>
<option value="1946">1946</option>
<option value="1945">1945</option>
<option value="1944">1944</option>
<option value="1943">1943</option>
<option value="1942">1942</option>
<option value="1941">1941</option>
<option value="1940">1940</option>
<option value="1939">1939</option>
<option value="1938">1938</option>
<option value="1937">1937</option>
<option value="1936">1936</option>
<option value="1935">1935</option>
<option value="1934">1934</option>
<option value="1933">1933</option>
<option value="1932">1932</option>
<option value="1931">1931</option>
<option value="1930">1930</option>
<option value="1929">1929</option>
<option value="1928">1928</option>
<option value="1927">1927</option>
<option value="1926">1926</option>
<option value="1925">1925</option>
<option value="1924">1924</option>
<option value="1923">1923</option>
<option value="1922">1922</option>
<option value="1921">1921</option>
<option value="1920">1920</option>
<option value="1919">1919</option>
<option value="1918">1918</option>
<option value="1917">1917</option>
<option value="1916">1916</option>
<option value="1915">1915</option>
<option value="1914">1914</option>
<option value="1913">1913</option>
<option value="1912">1912</option>
<option value="1911">1911</option>
<option value="1910">1910</option>
<option value="1909">1909</option>
<option value="1908">1908</option>
<option value="1907">1907</option>
<option value="1906">1906</option>
<option value="1905">1905</option>
<option value="1904">1904</option>
<option value="1903">1903</option>
<option value="1902">1902</option>
<option value="1901">1901</option>

                                  </select>
                                </div>
                            </div>
        {/*                      <DatePickerInput
                                      maxDate={today}
                                      className='my-react-datepicker'
                                      value={this.state.value}
                                      onChange={(jsDate) => this.setState({dateregip: jsDate})}
                                      locale='ru'
                                      placeholder="Дата гос. регистрации ИП"/> */}
                            </div>
                            <div className="form-group">
                                <input onChange={this.changePerson} type="text"
                                 className={"form-control " + (( this.state.valid_err.includes("addressregip")) ? ('input_err') : (''))} id="inputLastname" name="addressregip" placeholder="Адрес регистрации в качестве ИП" />
                            </div>
                              <div className="form-group">
                                <a href='policy.pdf'>Политика конфиденциальности</a><br/>
                                    <Link to='agreement.pdf' target="_blank">Пользовательское соглашение</Link>
                              </div>

                            <div className="form-group clearfix">
                          
                                <div className="checkbox-custom checkbox-inline checkbox-primary float-left">
                                    <input type="checkbox" id="inputCheckbox" name="term" checked={this.state.isChecked} onChange={this.toggleAgree.bind(this)} />
                                    <label htmlFor="inputCheckbox" />
                                    
                                </div>
                                <p className="ml-40">Регистрируясь, вы принимаете наши </p>
                            </div>
                             
                            <button type="button" onClick={this.submit.bind(this)} className="btn btn-primary btn-block">Регистрация</button>
                        </form>
                     
                        <p>У вас уже есть аккаунт? Пожалуйста, <Link to="/signin" className="waves-effect" >войдите</Link></p>
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
