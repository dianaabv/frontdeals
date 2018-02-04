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
            num_check: '',
            udv_check: '',
            email_check: '',
            iin_check: '',
            pass_err: '',
            issueddate: "",
            birthday: "",
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
            email_err: '',
            checkContent: false,
            checkContentIp: false

        },
        this.changeRender = this.changeRender.bind(this)
        this.changeRenderIp = this.changeRenderIp.bind(this)
        this.changePerson = this.changePerson.bind(this)
        this.changeIp = this.changeIp.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        // checkContentIp =
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
        console.log('ok')
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
    if(this.state.udv_check.length!=0  || this.state.email_check.length!=0 || this.state.iin_check.length!=0){
        console.log('Проверьте поля. Информация не обновлена')
        swal("Проверьте поля. Информация не обновлена")
    } else {
        const formData = `person=${JSON.stringify(this.state.person)}&birthday=${this.state.birthday}&issueddate=${this.state.issueddate}`;
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
            if(String(this.state.person.udv).length!=12){
                this.setState({
                    udv_err: '№ Удостоверения личности должен состоять из 12 цифр'
                })
            } else{
                this.setState({
                    udv_err: ''
                })
            }

        }
        if(field =='iin'){
            if(String(this.state.person.iin).length!=9){
                this.setState({
                    iin_err: 'ИИН должен состоять из 9 цифр'
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
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-pencil-square-o" aria-hidden="true" />Редактировать личную информацию</h3>
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
                                                    <button className="btn btn-primary btn-block d1" onClick={this.changeRender} >Редактировать</button>
                                                </div>
                                            </div>):(                                            <div className="col-12">
                                           
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
                                              {/*  <div className="form-group">
                                                                                                  <h4>Email</h4>
                                                                                                  <input type="text" defaultValue={this.state.user.email} name='email' onChange={this.changePerson} className="form-control"   />
                                                                                                  <h5>{this.state.email_err}</h5>
                                                                                              </div>*/}
                                                <div className="form-group">
                                                    <h4>Дата Рождения</h4>
                                                    <label className="form-control-label">{this.state.user.birthday}</label>
                                                       <DatePickerInput
                                                        maxDate={today}
                                                        className='my-react-datepicker'
                                                        value={this.state.value}
                                                        onChange={(jsDate) => this.setState({birthday: jsDate, checkContent: true})}
                                                        locale='ru'
                                                        placeholder="Дата Рождения"/>
                                                </div>
                                                <div className="form-group">
                                                    <h4>№ Удостоверения личности</h4>
                                                    <input type="number" defaultValue={this.state.user.udv} name='udv' onChange={this.changePerson} className="form-control"   />
                                                    <h5>{this.state.udv_err}</h5>
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
                                                        <DatePickerInput
                                                        maxDate={today}
                                                        className='my-react-datepicker'
                                                        value={this.state.value}
                                                        onChange={(jsDate) => this.setState({issueddate: jsDate, checkContent: true})}
                                                        locale='ru'
                                                        placeholder="Дата выдачи уд-ния личности"/>
                                                </div>
                                                <div className="form-group">
                                                    <h4>ИИН</h4>
                                                    <input type="number" defaultValue={this.state.user.iin} name='iin' onChange={this.changePerson} className="form-control"   />
                                                    <h5>{this.state.iin_err}</h5>
                                                </div>
                                                <div className="form-group">
                                                    <h4>Адрес регистрации</h4>
                                                    <input type="text" defaultValue={this.state.user.address} name='address' onChange={this.changePerson} className="form-control"   />
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btn-block d1" disabled={!this.state.checkContent}  onClick={this.updatePersonalInfo.bind(this)}>Сохранить изменения</button>
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btn-block d1" onClick={this.changeRender} >Отменить изменения</button>
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
                                <div className="panel ">
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
                                </div>
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
                                                    <input onChange={this.changePassword}  type="password"  name="password2" className="form-control" placeholder="Повторный пароль" />
                                                    <p>{this.state.pass_err}</p>
                                                </div>
                                                 <div className="form-group">
                                                    <h4>{this.state.message}</h4>
                                                    <button className="btn btn-primary btn-block " onClick={this.updatePassword} >Сменить пароль</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="panel ">
                                  <div className="panel-heading">
                                        <h3 className="panel-title"><i className="panel-title-icon icon fa fa-gavel" aria-hidden="true" />Общая информация о моих сделках</h3>
                                    </div>
                                </div>
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
                                                    <label className="form-control-label"> {this.state.user.dateregip} </label>
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
                                                    <input type="text" defaultValue={this.state.user.noregip} name='noregip' onChange={this.changeIp} className="form-control"   />
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
