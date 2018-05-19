import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import InputElement from 'react-input-mask';
import swal from 'sweetalert'
import Modal from 'react-responsive-modal';

class LoginPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      password:'',
      password2: '',
      smscode:'',
      username:'',
        open1: false,
      pass_err: '',
      user: {
      username:'',
      password: '',
      password2: ''
    },
      errors: {},
      checkContent: false
    }
    this.changeUser = this.changeUser.bind(this);
    this.sendSmsCode = this.sendSmsCode.bind(this)

  }
  onOpenModal = () => {
 this.setState({ open1: true });
};

onCloseModal = () => {
 this.setState({ open1: false });
};
    changeUser(event){
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    if(field=='password2'){
        if(this.state.user.password != this.state.user.password2){
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
    if((this.state.user.username.length > 0) && (this.state.user.password.length > 0)){
      this.setState({
        user: user,
        checkContent: true
      })
    }else {
      this.setState({
        user: user,
        checkContent: false
      })
    }
  }
  submit(){
       // this.setState({ open1: true })
       //console.log(this.state.user.username.length)
       if(this.state.user.username.length!=0){
         //console.log(this.state.my_id)

       var   username=this.state.user.username.replace(/[{()}]/g, '')
       username=username.replace(/[{ }]/g, '');
       username=username.replace(/-/g, '');
       username=username.replace('+', '')
         const formData = `user_id=${username}`
           axios.post('http://185.100.67.106:4040/api/repeatsms1',formData, {
           responseType: 'json',
           headers: {
               'Content-type': 'application/x-www-form-urlencoded',

           }
       })
       .then(res => {
         this.setState({
           message: res.data.message
         });

   if(res.data.message =='Мы выслали вам повторный код.'){
     // console.log('adasd')
            this.setState({ open1: true })
   } else{
swal(res.data.message)
   }




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
         swal("Вы не ввели сотовый номер")
       }

  }
sendSmsCode(){

  if(this.state.password==this.state.password2){


    var   username=this.state.user.username.replace(/[{()}]/g, '')
    username=username.replace(/[{ }]/g, '');
    username=username.replace(/-/g, '');
    username=username.replace('+', '')
    const formData = `username=${username}&password=${this.state.password}&smscode=${this.state.smscode}`;
            axios.post('http://185.100.67.106:4040/api/changepassword',formData, {
            responseType: 'json',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',

            }
        })
        .then(res => {
          this.setState({
            message: res.data.message
          });
          if(res.data.message=='Пароль успешно изменен.'){
              swal({text: res.data.message}).then(function(){window.location = "/signin";})
          } else{
            swal(res.data.message)
          }


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

  }else{
    swal('Пароли должны совпадать')
  }




}
  render() {
    // console.log(this.state.user.username)
    return (
      <div className="col-md-4" data-animsition-in="fade-in" data-animsition-out="fade-out">
        <div className="page-content">
                     {this.state.errors.summary && <p style={{ fontSize: '14px', color: 'red' }}>{this.state.errors.summary}</p>}

                        <div className="page-brand-info">
                            <div className="brand">

                                <h2 className="brand-text font-size-40">Сделки LegCo</h2>
                            </div>
                            <p className="font-size-20">Цифровой способ заключения сделок.</p>
                        </div>
                        <div className="page-login-main animation-slide-right animation-duration-1">

                            <h3 className="font-size-24">Восставновление Пароля</h3>
                            <form>
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="inputEmail">Телефон</label>
                                       <InputElement mask="+7 (999) 999-99-99" className="form-control"
                             placeholder="Введите номер телефона"
                              name="username"
                       value={this.state.user.username}
                      onChange={this.changeUser} />
                                </div>
                              { /* <div className="form-group">

                                    <input  value={this.state.user.password} onChange={this.changeUser}  type="password" className="form-control"
                                     id="inputPassword" name="password" placeholder="Новый Пароль" />
                                </div>
                                 <div className="form-group">

                                    <input  value={this.state.user.password2} onChange={this.changeUser}  type="password" className="form-control"
                                     id="inputPassword" name="password2" placeholder="Повторный пароль" />
                                </div>
*/}
                                <h4>{this.state.pass_err}</h4>
                                <button onClick={this.submit.bind(this)} type="button" className="btn btn-primary btn-block">Cменить пароль</button>
                                <p>{this.state.message}</p>
                            </form>
                            <Modal open={this.state.open1} onClose={this.onCloseModal} little>
                              <h2>Код подтвеждения</h2>
                              <div className="form-group">
                                <h4 className="form-control-label"  >В течение минуты к вам придет смс подтверждение.</h4>
                                <input  placeholder="Смс код" onChange={(event)=>{
                                            this.setState({smscode: event.target.value})
                                            }}  type="text" className="form-control"   name="order"   autoComplete="off" />
                              </div>
                              <div className="form-group">

                                    <input   onChange={(event)=>{
                                                this.setState({password: event.target.value})
                                                }} type="password" className="form-control"
                                     id="inputPassword" name="password" placeholder="Новый Пароль" />
                                </div>
                                 <div className="form-group">

                                    <input   onChange={(event)=>{
                                                this.setState({password2: event.target.value})
                                                }}  type="password" className="form-control"
                                     id="inputPassword" name="password2" placeholder="Повторный пароль" />
                                </div>
                              <button className="btn btn-primary btn-block " onClick={this.sendSmsCode}>Cменить пароль</button>
                          {/*    <button className="btn "onClick={this.repeatSmsCode}>Отправить повторный код</button>*/}
                            </Modal>
                            <p> <Link to="/signin" className="waves-effect"  >Войдите</Link></p>
                            <footer className="page-copyright">
                                <p>Сделки LegCo</p>
                                <p>© 2018. Все права защищены.</p>
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
        </div>);
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
