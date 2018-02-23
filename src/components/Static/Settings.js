import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import 'moment/locale/ru.js';
import swal from 'sweetalert'
import { DatePicker, DatePickerInput } from 'rc-datepicker';





class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test:'',
            message: '',
            status: '',
            user: {},
            isChangable: true,
            isChangableIp:true,
            udv_err: '',
            iin_err: '',
            email_err: '',
            // num_check: '',
            // udv_check: '',
            // email_check: '',
            iin_check: '',
            pass_err: '',
            // issueddate: "",
            birthday: {
              dob_day: '',
              dob_month: '',
              dob_year: ''
            },
            issueddate:{
              issueddate_day: '',
              issueddate_month: '',
              issueddate_year: ''
            },
            email: '',
            person: {
                firstname: "",
                lastname: "",
                midname: "",
                // email: "",
                udv: "",
                issuedby: "",
                iin: "",
                address: ""
            },
            dateregip: '',
            changeIp: {
                nameip: '',
                noregip: '',
                addressregip: ''
            },
            password: {
                oldpassword: '',
                password: '',
                password2: ''
            },
            checkContent: false,
            checkContentIp: false,
            valid_err: [],
            valid_err1: []

        },
        this.changeRender = this.changeRender.bind(this)
        this.changeRenderIp = this.changeRenderIp.bind(this)
        this.changePerson = this.changePerson.bind(this)
        this.changeIp = this.changeIp.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.dateFormat=this.dateFormat.bind(this); 
        this.changeDob=this.changeDob.bind(this);
        this.changeIssuedDate=this.changeIssuedDate.bind(this);
        // checkContentIp =
    }
    dateFormat(date){
      var fDate = new Date(date);
      var m = ((fDate.getMonth() * 1 + 1) < 10) ? ("0" + (fDate.getMonth() * 1 + 1)) : (fDate.getMonth() * 1 + 1);
      var d = ((fDate.getDate() * 1) < 10) ? ("0" + (fDate.getDate() * 1)) : (fDate.getDate() * 1);
      return d + "/" + m + "/" + fDate.getFullYear()
    }
    GetTest(){
        axios.get('http://185.100.67.106:4040/api/gettest',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           user: res.data.user
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
  })
        
    }
    Test(){
      axios.get('http://185.100.67.106:4040/api/test?test='+this.state.test,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           user: res.data.user
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
    updatePassword(){
        const formData = `oldpassword=${this.state.password.oldpassword}&password=${this.state.password.password}`;
        if(this.state.pass_err.length!=0){
            swal("Пароли не совпадают. Информация не обновлена")
        } else {
            axios.post('http://185.100.67.106:4040/api/updatepassword',formData,{
                responseType: 'json',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Authorization': `bearer ${Auth.getToken()}`
                }
            }).then(res => {
                this.setState({
                    message: res.data.message
                });
                swal({ text: this.state.message}).then(function(){window.location.reload()})
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

    }
    changePassword(event) {
        //console.log(event)
        const field = event.target.name;
        const password = this.state.password;
        password[field] = event.target.value;
        console.log(this.state.password)

        if(field =='password2'){
            if(this.state.password.password != this.state.password.password2){
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
    }
    updateIp(){
        // console.log(this.state.changeIp)
        // console.log(this.state.dateregip)
        const formData = `changeIp=${JSON.stringify(this.state.changeIp)}&dateregip=${this.state.dateregip}`;
        axios.post('http://185.100.67.106:4040/api/updateipinfo',formData,{
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
    updatePersonalInfo(){
    if(this.state.valid_err.length!=0 ||this.state.valid_err1.length!=0 ||this.state.udv_err.length!=0  || this.state.iin_err.length!=0){
        swal("Проверьте поля. Информация не обновлена")
    } else {

        
        const formData = `person=${JSON.stringify(this.state.person)}&birthday=${this.state.birthday.dob_day+'/'+this.state.birthday.dob_month+'/'+this.state.birthday.dob_year}&issueddate=${this.state.issueddate.issueddate_day+'/'+this.state.issueddate.issueddate_month+'/'+this.state.issueddate.issueddate_year}`;
        console.log(formData)
        axios.post('http://185.100.67.106:4040/api/updatepersonalinfo',formData,{
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
    }
    changeDob(event){
        this.setState({
            checkContent: true
        })
        const field = event.target.name;
        const dob = this.state.birthday;
        dob[field] = event.target.value; 
               var birthday1 =  {
          dob_day: this.state.birthday.dob_day,
          dob_month: this.state.birthday.dob_month,
          dob_year: this.state.birthday.dob_year
             
        }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(birthday1)
      var valid_err = Object.keys(mainobj)
      this.setState({
        valid_err: valid_err
      })
    }
    changeIssuedDate(event){
        this.setState({
            checkContent: true
        })
        const field = event.target.name;
        const issueddate = this.state.issueddate;
        issueddate[field] = event.target.value; 
               var birthday1 =  {
          issueddate_day: this.state.issueddate.issueddate_day,
          issueddate_month: this.state.issueddate.issueddate_month,
          issueddate_year: this.state.issueddate.issueddate_year
             
        }
      const removeEmpty = (obj) => {Object.keys(obj).forEach((key) => (obj[key].length != 0) && delete obj[key]); return obj;}
      var mainobj=removeEmpty(birthday1)
      var valid_err1 = Object.keys(mainobj)
      this.setState({
        valid_err1: valid_err1
      })

    }

    changeIp(event){
        this.setState({
            checkContentIp: true
        })
        const field = event.target.name;
        const ip = this.state.changeIp;
        ip[field] = event.target.value; 
    }
    changePerson(event){
        this.setState({
            checkContent: true
        })
        const field = event.target.name;
        const person = this.state.person;
        person[field] = event.target.value;
        if(field =='udv'){
            if(String(this.state.person.udv).length!=9){
                this.setState({
                    udv_err: '№ Удостоверения личности должен состоять из 9 цифр'
                })
            } else{
                this.setState({
                    udv_err: ''
                })
            }

        }
        if(field =='iin'){
            if(String(this.state.person.iin).length!=12){
                this.setState({
                    iin_err: 'ИИН должен состоять из 12 цифр'
                })
            } else{
                this.setState({
                    iin_err: ''
                })
            }

        }
        if(field== 'email'){
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var test = re.test(this.state.person.email);
            if(!test) {
                this.setState({
                    email_err: 'Неправильный формат почты. '
                })
            } else{
                this.setState({
                    email_err: ''
                })
            }
        }
    }
    changeRender(){
        this.setState({
            isChangable:  !this.state.isChangable
        })
    }
    changeRenderIp(){
        this.setState({
            isChangableIp: !this.state.isChangableIp
        })
    }
    componentWillMount(){
        var token = Auth.getToken();
        var decoded = jwtDecode(token);
        this.setState({
          status: decoded.userstatus
        });
    }
    changeEmail(){
        console.log(this.state.email, 'email')
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var test = re.test(this.state.email);
        if(!test) {
            this.setState({
                email_err: 'Неправильный формат почты. '
            })
        } else{
            this.setState({
                email_err: ''
            })
            axios.get('http://185.100.67.106:4040/api/updateemail?email='+this.state.email,{
                responseType: 'json',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded',
                  'Authorization': `bearer ${Auth.getToken()}`
              }
              }).then(res => {
                  this.setState({
                   message: res.data.message
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
    }
    componentDidMount() {
        axios.get('http://185.100.67.106:4040/api/getmydashboard',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           user: res.data.user
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

    render() {
        const today=new Date();
        const yesterday = new Date();
        yesterday.setFullYear(yesterday.getFullYear() -18)  
        // console.log(this.state.status)
        //console.log(this.state.test)
        return (

                <div className="page">
                    <div className="page-content container-fluid">
                        <div className="panel">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="panel-title-icon icon fa fa-user-o" aria-hidden="true" />Личная Информация</h3>
                            </div>
                        </div>
                        <div className="row">
                           <div className="col-md-4">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-pencil-square-o" aria-hidden="true" />Мой профиль</h3>
                                    </div>
                                </div>
                                <div className="panel ">
                                <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Редактировать личную информацию</h3>
                                    </div>
                                    <div className="panel-body container-fluid">

                                        <div className="row">
                                         {(this.state.isChangable=='1')?(                                            <div className="col-12">
                                                <div className="form-group">
                                                    <h4>Cотовый</h4>
                                                    <div className="input-group">
                                                            <span className="input-group-addon">+7</span>
                                                            <label type="text" defaultValue={this.state.user.username} name='username'className="form-control"   > {this.state.user.username} </label>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Имя</h4>
                                                    <label className="form-control-label">{this.state.user.firstname}  </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Фамилия</h4>
                                                    <label className="form-control-label">{this.state.user.lastname}  </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Отчество</h4>
                                                    <label className="form-control-label"> {this.state.user.midname} </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Email</h4>
                                                    <label className="form-control-label"> {this.state.user.email} </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Дата Рождения</h4>
                                                    <label className="form-control-label"> {this.state.user.birthday} </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>№ Удостоверения личности</h4>
                                                    <label className="form-control-label"> {this.state.user.udv} </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Орган, выдавший уд-ние личности</h4>
                                                    <label className="form-control-label"> {this.state.user.issuedby} </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Дата выдачи уд-ния личности</h4>
                                                    <label className="form-control-label">{this.state.user.issueddate}  </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>ИИН</h4>
                                                    <label className="form-control-label"> {this.state.user.iin} </label>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Адрес регистрации</h4>
                                                    <label className="form-control-label">{this.state.user.address}  </label>
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btn-block " onClick={this.changeRender} >Редактировать</button>
                                                </div>
                                            </div>):(                                            
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <h4>Имя</h4>
                                                    <input type="text" defaultValue={this.state.user.firstname} name='firstname' onChange={this.changePerson} className="form-control"   />
                                                </div>
                                                <div className="form-group">
                                                    <h4>Фамилия</h4>
                                                    <input type="text" defaultValue={this.state.user.lastname} name='lastname' onChange={this.changePerson} className="form-control"   />
                                                </div>
                                                <div className="form-group">
                                                    <h4>Отчество</h4>
                                                    <input type="text" defaultValue={this.state.user.midname} name='midname' onChange={this.changePerson} className="form-control"   />
                                                </div>
                                              {/*<div className="form-group">
                                                                                                  <h4>Email</h4>
                                                                                                  <input type="text" defaultValue={this.state.user.email} name='email' onChange={this.changePerson} className="form-control"   />
                                                                                                  <h5>{this.state.email_err}</h5>
                                                                                              </div>*/}
                                                <div className="form-group">
                                                    <h4>Дата Рождения</h4>
                                                    <label className="form-control-label">Текущие данные: {this.state.user.birthday}</label>
                                                       
                            <div className="row">
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err.includes("dob_day")) ? ('input_err') : (''))} onChange={this.changeDob} name="dob_day" >
                                    <option value='' >День</option>
<option value="01">1</option>
<option value="02">2</option>
<option value="03">3</option>
<option value="04">4</option>
<option value="05">5</option>
<option value="06">6</option>
<option value="07">7</option>
<option value="08">8</option>
<option value="9">9</option>
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
                                  <select className={"form-control " + (( this.state.valid_err.includes("dob_month")) ? ('input_err') : (''))}  onChange={this.changeDob} name="dob_month"  >
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
                                  <select className={"form-control " + (( this.state.valid_err.includes("dob_year")) ? ('input_err') : (''))}  onChange={this.changeDob} name="dob_year" >
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
                                                {/*       <DatePickerInput
                                                                                                        maxDate={today}
                                                                                                        className='my-react-datepicker'
                                                                                                        value={this.state.value}
                                                                                                        onChange={(jsDate) => this.setState({birthday: jsDate, checkContent: true})}
                                                                                                        locale='ru'
                                                                                                        placeholder="Дата Рождения"/>*/}
                                                </div>
                                                <div className="form-group">
                                                    <h4>№ Удостоверения личности</h4>
                                                    <input type="number" defaultValue={this.state.user.udv} className={"form-control " + (this.state.udv_err.length !=0  ? 'input_err' : '')} name='udv' onChange={this.changePerson}   />
                                                    <h5 className="err_red">{this.state.udv_err}</h5>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Орган, выдавший уд-ние личности</h4>
                                                    <select className="form-control" onChange={this.changePerson} name="issuedby" value={this.state.person.issuedby}>
                                                        <option value="" >Орган, выдавший уд-ние личности</option>
                                                        <option value="МВД РК" >МВД РК</option>
                                                        <option value="Министерство юстиции Республики Казахстан">Министерство юстиции Республики Казахстан</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Дата выдачи уд-ния личности</h4>
                                                    <label className="form-control-label">Текущие данные: {this.state.user.issueddate}</label>
                                                          
                            <div className="row">
                                <div className="col-md-4">
                                  <select className={"form-control " + (( this.state.valid_err1.includes("issueddate_day")) ? ('input_err') : (''))}  onChange={this.changeIssuedDate} name="issueddate_day"  >
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
                                  <select className={"form-control " + (( this.state.valid_err1.includes("issueddate_month")) ? ('input_err') : (''))}  onChange={this.changeIssuedDate} name="issueddate_month"  >
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
                                  <select className={"form-control " + (( this.state.valid_err1.includes("issueddate_year")) ? ('input_err') : (''))}  onChange={this.changeIssuedDate} name="issueddate_year"  >
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
                                                    {/*    <DatePickerInput
                                                                                                            maxDate={today}
                                                                                                            className='my-react-datepicker'
                                                                                                            value={this.state.value}
                                                                                                            onChange={(jsDate) => this.setState({issueddate: jsDate, checkContent: true})}
                                                                                                            locale='ru'
                                                                                                            placeholder="Дата выдачи уд-ния личности"/>*/}
                                                </div>
                                                <div className="form-group">
                                                    <h4>ИИН</h4>

                                                    <input type="number" defaultValue={this.state.user.iin} name='iin' className={"form-control " + (this.state.iin_err.length !=0  ? 'input_err' : '')}  onChange={this.changePerson}   />
                                                    <h5 className="err_red">{this.state.iin_err}</h5>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Адрес регистрации</h4>
                                                    <input type="text" defaultValue={this.state.user.address} name='address' onChange={this.changePerson} className="form-control"   />
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btn-block " disabled={!this.state.checkContent}  onClick={this.updatePersonalInfo.bind(this)}>Сохранить изменения</button>
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btn-block " onClick={this.changeRender} >Отменить изменения</button>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-users" aria-hidden="true" />Настройки Входа</h3>
                                    </div>
                                </div>
                    {/*            <div className="panel ">
                                                        <div className="panel-heading">
                                                            <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Сменить сотовый телефон </h3>
                                                        </div>
                                                        <div className="panel-body container-fluid">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <h4>Cотовый</h4>
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">+7</span>
                                                                            <input type="text" defaultValue={this.state.user.username} name='username' onChange={this.changePerson} className="form-control"   />
                                                                        </div>
                                                                        <h5>{this.state.num_err}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                           <div className="panel ">
                                                        <div className="panel-heading">
                                                            <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Сменить почту </h3>
                                                        </div>
                                                        <div className="panel-body container-fluid">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <h4>Email</h4>
                                                                        <div className="input-group">
                                                                            <input type="text" name='email' onChange={(event)=>{this.setState({email: event.target.value})}} className="form-control"   />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <h4>{this.state.email_err}</h4>
                                                                            <h4>{this.state.message}</h4>
                                                                            <button className="btn btn-primary btn-block " onClick={this.changeEmail.bind(this)} >Сменить почту</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                                <div className="panel ">
                                                        <div className="panel-heading">
                                                            <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Тест</h3>
                                                        </div>
                                                        <div className="panel-body container-fluid">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <h4>Cотовый</h4>
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">+7</span>
                                                                            <input type="text"  name='username'onChange={(event)=>{
                                                        this.setState({test: event.target.value})
                                                        }} className="form-control"   />
                                                                        </div>
                                                                        <h5>{this.state.num_err}</h5>
                                                                    </div>
                                                                      <div className="form-group">
                                                                        <h4>{this.state.message}</h4>
                                                                        <button className="btn btn-primary btn-block " onClick={this.Test.bind(this)} >Тест</button>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <h4>{this.state.message}</h4>
                                                                        <button className="btn btn-primary btn-block " onClick={this.GetTest.bind(this)} >get Тест</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>*/}
                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Сменить пароль</h3>
                                    </div>
                                    <div className="panel-body container-fluid">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <h4>Старый Пароль</h4>
                                                    <input onChange={this.changePassword} type="password" className="form-control" name="oldpassword" placeholder="Пароль" />
                                                </div>
                                                <div className="form-group">
                                                    <h4>Новый Пароль</h4>
                                                    <input onChange={this.changePassword} type="password" className="form-control" name="password" placeholder="Пароль" />
                                                </div>
                                                <div className="form-group">
                                                    <h4>Повторите Новый Пароль</h4>
                                                    <input onChange={this.changePassword}  type="password"  name="password2"className={"form-control " + (this.state.pass_err.length !=0  ? 'input_err' : '')} placeholder="Повторный пароль" />
                                                
                                                    <h5 className="err_red">{this.state.pass_err}</h5>
                                                </div>
                                                 <div className="form-group">
                                                    <button className="btn btn-primary btn-block " onClick={this.updatePassword} >Сменить пароль</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">

                                      { (this.state.status=='Индивидуальный предприниматель')? (

                                <div className="panel ">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Редактировать информацию по ИП </h3>
                                    </div>
                                     {(this.state.isChangableIp=='1')?(
                                     <div className="panel-body container-fluid">
                                        <div className="form-group">
                                                    <h4>Наименование ИП</h4>
                                                    <label className="form-control-label"> {this.state.user.nameip} </label>
                                        </div>
                                        <div className="form-group">
                                                    <h4>Номер свидетельства о гос. регистрации ИП</h4>
                                                    <label className="form-control-label"> {this.state.user.noregip} </label>
                                        </div>
                                        <div className="form-group">
                                                    <h4>Дата гос. регистрации ИП</h4>
                                                    <label className="form-control-label"> {this.dateFormat(this.state.user.dateregip)} </label>
                                        </div>
                                        <div className="form-group">
                                                    <h4>Адрес регистрации в качестве ИП</h4>
                                                    <label className="form-control-label"> {this.state.user.addressregip} </label>
                                        </div>
                                        <div className="form-group">
                                                    <button className="btn btn-primary btn-block d1" onClick={this.changeRenderIp} >Редактировать</button>
                                        </div>
                                    </div>):(
                                        <div className="panel-body container-fluid">
                                        <div className="form-group">
                                                    <h4>Наименование ИП</h4>
                                                    <input type="text" defaultValue={this.state.user.nameip} name='nameip' onChange={this.changeIp} className="form-control"   />
                                        </div>
                                        <div className="form-group">
                                                    <h4>Номер свидетельства о гос. регистрации ИП</h4>
                                                    <input type="number" defaultValue={this.state.user.noregip} name='noregip' onChange={this.changeIp} className="form-control"   />
                                        </div>
                                        <div className="form-group">
                                                    <h4>Дата гос. регистрации ИП</h4>
    
                                                        <DatePickerInput
                                                        maxDate={today}
                                                        className='my-react-datepicker'
                                                        value={this.state.value}
                                                        onChange={(jsDate) => this.setState({dateregip: jsDate, checkContentIp: true})}
                                                        locale='ru'
                                                        placeholder="Дата выдачи уд-ния личности"/>
                                        </div>
                                        <div className="form-group">
                                                    <h4>Адрес регистрации в качестве ИП</h4>
                                                    <input type="text" defaultValue={this.state.user.addressregip} name='addressregip' onChange={this.changeIp} className="form-control"   />                                        </div>
                                        <div className="form-group">
                                                    <button className="btn btn-primary btn-block d1"  disabled={!this.state.checkContentIp} onClick={this.updateIp.bind(this)} >Сохрнаить изменения по ИП</button>
                                        </div>
                                    </div>
)}
                             
                                </div>):(<div></div>)}
                            </div>
                        </div>
                    </div>
                </div>   
                              
                            

        );
    }
}

export default MyDealsParent;
