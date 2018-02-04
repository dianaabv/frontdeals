import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import InputElement from 'react-input-mask';

class LoginPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      user: {
      username:'',
      password: ''},
      errors: {},
      checkContent: false
    };
    this.changeUser = this.changeUser.bind(this);

  }
    changeUser(event){
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
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
    var name=this.state.user.username.replace(/[{()}]/g, '')
    name=name.replace(/[{ }]/g, '');
    name=name.replace(/-/g, '');
    console.log(username)
  const username = encodeURIComponent(name);
  const password = encodeURIComponent(this.state.user.password);
  const formData = `username=${username}&password=${password}`;
  console.log(formData,'formData')
  axios.post('http://185.100.67.106:4040/auth/login', formData, {
    responseType: 'json',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': `bearer ${Auth.getToken()}`
    }
  })
    .then(res => {
        this.setState({
          errors: {}
        });
        Auth.authenticateUser(res.data.token);
        this.context.router.history.push('/')
        window.location.reload()
    })
      .catch(error => {
      if (error.response) {
        const errors = error.response ? error.response : {};
        errors.summary = error.response.data.message;
        this.setState({
          errors
        });
        console.log(errors.summary);
      }
      });
    }

  render() {
    return (
      <div className="col-md-12" data-animsition-in="fade-in" data-animsition-out="fade-out">
      <div className="col-md-4">
        <div className="page-content">
                     {this.state.errors.summary && <p style={{ fontSize: '14px', color: 'red' }}>{this.state.errors.summary}</p>}

                        <div className="page-brand-info">
                            <div className="brand">
                               
                                <h2 className="brand-text font-size-40">Сделки LegCo</h2>
                            </div>
                            <p className="font-size-20">Цифровой способ заключения сделок.</p>
                        </div>
                        <div className="page-login-main animation-slide-right animation-duration-1">
                            <h3 className="font-size-24">Войти</h3>
                            <p>Добро пожаловать</p>
                            <form>
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="inputEmail">Телефон</label>
                                       <InputElement mask="+7 (999) 999-99-99" className="form-control"
                             placeholder="Введите номер телефона"
                              name="username"
                       value={this.state.user.username}
                      onChange={this.changeUser} />
                                </div>
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="inputPassword">Пароль</label>
                                    <input  value={this.state.user.password} onChange={this.changeUser}  type="password" className="form-control"
                                     id="inputPassword" name="password" placeholder="Пароль" />
                                </div>
                                <div className="form-group clearfix">
                                    <div className="checkbox-custom checkbox-inline checkbox-primary float-left">
                                        <input type="checkbox" id="rememberMe" name="rememberMe" />
                                        <label htmlFor="rememberMe">Запомнить</label>
                                    </div>
                                    <Link to="/forgotpassword" className="float-right" >Забыли пароль?</Link>
                                </div>
                                <button onClick={this.submit.bind(this)} type="button" className="btn btn-primary btn-block">Войти</button>
                                <p>{this.state.message}</p>
                            </form>
                            <p>Нет аккаунта?  <Link to="/signup" className="waves-effect"  >Зарегистрируйтесь</Link></p>
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
        </div>
        

        </div>);
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
