import './style.css';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
//import jwtDecode from 'jwt-decode';
import socketIOClient from "socket.io-client";
import axios from 'axios';




class App extends Component {
   constructor(){
    super();
    this.state={
        endpoint: "http://185.100.67.106:4040",
        userTimeLines: '',
        dealtimelines: '',
        sumNoty: ''
    }
    this.notifyMe=this.notifyMe.bind(this)
    this.getMyNotifications = this.getMyNotifications.bind(this)
     this.dateFormat=this.dateFormat.bind(this); 
   }
    componentDidMount() {
            axios.get('http://185.100.67.106:4040/api/getmynotifications',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           userTimeLines: res.data.userTimeLines,
           dealtimelines: res.data.dealtimelines,
           sumNoty: res.data.sumNoty
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
    getMyNotifications(){
      axios.get('http://185.100.67.106:4040/api/getmynotifications',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           userTimeLines: res.data.userTimeLines,
           dealtimelines: res.data.dealtimelines,
           sumNoty: res.data.sumNoty
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
    send = () => {
      const socket = socketIOClient(this.state.endpoint);
      var token = Auth.getToken();
      //var decoded = jwtDecode(token);
     // socket.emit('register', decoded.sub) // change 'red' to this.state.color
    }
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}
  notifyMe(){
    console.log('noty')
   // Проверка поддерживаемости браузером уведомлений
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Проверка разрешения на отправку уведомлений
  else if (Notification.permission === "granted") {
    // Если разрешено то создаем уведомлений
    var notification = new Notification("Hi there!");
  }

  // В противном случает мы запрашиваем разрешение
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Если пользователь разрешил, то создаем уведомление 
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // В конечном счете если пользователь отказался от получения 
  // уведомлений, то стоит уважать его выбор и не беспокоить его 
  // по этому поводу .
  }
      dateFormat(date){
      var fDate = new Date(date);
      var m = ((fDate.getMonth() * 1 + 1) < 10) ? ("0" + (fDate.getMonth() * 1 + 1)) : (fDate.getMonth() * 1 + 1);
      var d = ((fDate.getDate() * 1) < 10) ? ("0" + (fDate.getDate() * 1)) : (fDate.getDate() * 1);
      return m + "/" + d + "/" + fDate.getFullYear()
    }


  render() {
    return (
      <div>
      {(Auth.isUserAuthenticated())? (
        <nav className="site-navbar navbar navbar-default navbar-fixed-top navbar-mega navbar-inverse bg-indigo-600" role="navigation">
                <div className="navbar-header">
         
                    <button type="button" className="navbar-toggler navbar-toggler-left hided mgtop" data-toggle="menubar">
                  
                        <ul className="nav navbar-toolbar">
                                 <a className="nav-link navbar-avatar" data-toggle="dropdown" href="#" aria-expanded="false" data-animation="scale-up" role="button">
                                              <i className="icon hamburger hamburger-arrow-left">
                                                   <span className="sr-only">Toggle menubar</span>
                                                   <span className="hamburger-bar" />
                                               </i>
                                           </a>
                                                            <div className="dropdown-menu" role="menu">
                                                                <Link className="dropdown-item" to="/dashboard" role="menuitem"><i className="icon wb-user" aria-hidden="true" /> Личный Кабинет</Link>
                                                                <Link className="dropdown-item" to="/deals" role="menuitem"><i className="icon fa fa-plus-circle" aria-hidden="true" /> Cоздать сделку</Link>
                                                                <Link className="dropdown-item" to="/mydeals" role="menuitem"><i className="icon fa fa-spinner" aria-hidden="true" /> Текущие сделки</Link>
                                                                <Link className="dropdown-item" to="/mydeals"role="menuitem"><i className="icon fa fa-check-square-o" aria-hidden="true" /> Завершеные сделки</Link>
                                                                <Link className="dropdown-item" to="/addkontragents" role="menuitem"><i className="icon fa fa-user-plus" aria-hidden="true" /> Добавить Контрагента</Link>
                                                                <Link className="dropdown-item" to="/mykontragents" role="menuitem"><i className="icon fa fa-users" aria-hidden="true" /> Мои Контрагенты</Link>
                                                                <Link className="dropdown-item" to="/kontragentrequest" role="menuitem"><i className="icon fa fa-exchange" aria-hidden="true" /> Заявки</Link>
                                                                <Link className="dropdown-item" to="/dealhistory"  role="menuitem"><i className="icon fa fa-list-ul" aria-hidden="true" /> История сделок</Link>
                                                                <Link className="dropdown-item" to="/mykontragents"role="menuitem"><i className="icon wb-payment" aria-hidden="true" /> Оплата</Link>

                                                                <div className="dropdown-divider" role="presentation" />
                                                                <Link to="/logout" className="dropdown-item" role="menuitem"><i className="icon wb-power" aria-hidden="true" /> Выйти</Link>
                                                            </div>
                           </ul>
                    </button>
                    <button type="button" className="navbar-toggler collapsed" data-target="#site-navbar-collapse" data-toggle="collapse">
                        <i className="icon wb-more-horizontal" aria-hidden="true" />
                    </button>
                    <div className="navbar-brand navbar-brand-center">
                        <img className="navbar-brand-logo" src="../../assets/images/logo1.png" title="Remark" />
                        <span className="navbar-brand-text hidden-xs-down"> </span>
                    </div>
                </div>
                <div className="navbar-container container-fluid">
                    {/* Navbar Collapse */}
                    <div className="collapse navbar-collapse navbar-collapse-toolbar" id="site-navbar-collapse">
                        {/* Navbar Toolbar */}
              
                    
                        <ul className="nav navbar-toolbar navbar-right navbar-toolbar-right">
                            <li className="nav-item dropdown">
                                <a className="nav-link" data-toggle="dropdown" href="javascript:void(0)" data-animation="scale-up" aria-expanded="false" role="button">
                                    <span className="flag-icon flag-icon-ru" />
                                </a>
                                <div className="dropdown-menu" role="menu">
                                    <a className="dropdown-item" href="javascript:void(0)" role="menuitem">
                                        <span className="flag-icon flag-icon-gb" /> English</a>
                                    <a className="dropdown-item" href="javascript:void(0)" role="menuitem">
                                        <span className="flag-icon flag-icon-ru" /> Русский</a>
                                    <a className="dropdown-item" href="javascript:void(0)" role="menuitem">
                                        <span className="flag-icon flag-icon-kz" /> Қазақша</a>
                                </div>
                            </li>
                          
                        {/* <li><Link to="/logout" className="waves-effect"><i className="fa fa-sign-out fa-lg icons" aria-hidden="true" ></i>
                                              <span className="hidden-menu-style hide-menu ">Выход</span></Link></li>*/}
             
                            <li className="nav-item dropdown">
                                <a className="nav-link" data-toggle="dropdown" href="javascript:void(0)" onClick = {this.getMyNotifications} title="Notifications" aria-expanded="false" data-animation="scale-up" role="button">
                                    <i className="icon wb-bell" aria-hidden="true" />
                                    <span className="badge badge-pill badge-danger up">{this.state.sumNoty}</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right dropdown-menu-media" role="menu">
                                    <div className="dropdown-menu-header">
                                        <h5>УВЕДОМЛЕНИЯ</h5>
                                        <span className="badge badge-round badge-danger">Новых {this.state.sumNoty}</span>
                                    </div>
                                    <div className="list-group">
                                        <div data-role="container">
                                            <div data-role="content">
                                            {this.state.userTimeLines.length !=0 ?(
                                              <div className="">
                                              {this.state.userTimeLines.map((user, s) =>
                                                  <a key={s} className="list-group-item dropdown-item" href="javascript:void(0)" role="menuitem">
                                                    <div className="media">
                                                        <div className="pr-10">
                                                            <i className="icon wb-user bg-green-600 white icon-circle" aria-hidden="true" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading">{user.title}</h6>
                                                            <h6 className="media-heading">{user.from.firstname} {user.from.lastname}</h6>
                                                            <time className="media-meta" dateTime={user.date}>{this.dateFormat(user.date)}</time>
                                                        </div>
                                                    </div>
                                                </a>
                                               )}
                                              </div>
                                            ) :(<p>asd</p>) }
                                            {this.state.dealtimelines.length !=0 ? (
                                              <div className="">
                                              {this.state.dealtimelines.map((user, s) =>
                                                  <a key={s} className="list-group-item dropdown-item" href="javascript:void(0)" role="menuitem">
                                                    <div className="media">
                                                        <div className="pr-10">
                                                            <i className="icon wb-order bg-red-600 white icon-circle" aria-hidden="true" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading">{user.title}</h6>
                                                            <h6 className="media-heading">{user.action_initiator.firstname} {user.action_initiator.lastname}</h6>
                                                            <time className="media-meta" dateTime={user.date}>{this.dateFormat(user.date)}</time>
                                                        </div>
                                                    </div>
                                                </a>
                                               )}
                                              </div>) :(<p></p>)}

                                               
{ /*                                               <a className="list-group-item dropdown-item" href="javascript:void(0)" role="menuitem">
                                                    <div className="media">
                                                        <div className="pr-10">
                                                            <i className="icon wb-user bg-green-600 white icon-circle" aria-hidden="true" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading">Completed the task</h6>
                                                            <time className="media-meta" dateTime="2017-06-11T18:29:20+08:00">2 days ago</time>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="list-group-item dropdown-item" href="javascript:void(0)" role="menuitem">
                                                    <div className="media">
                                                        <div className="pr-10">
                                                            <i className="icon wb-settings bg-red-600 white icon-circle" aria-hidden="true" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading">Settings updated</h6>
                                                            <time className="media-meta" dateTime="2017-06-11T14:05:00+08:00">2 days ago</time>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="list-group-item dropdown-item" href="javascript:void(0)" role="menuitem">
                                                    <div className="media">
                                                        <div className="pr-10">
                                                            <i className="icon wb-calendar bg-blue-600 white icon-circle" aria-hidden="true" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading">Event started</h6>
                                                            <time className="media-meta" dateTime="2017-06-10T13:50:18+08:00">3 days ago</time>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="list-group-item dropdown-item" href="javascript:void(0)" role="menuitem">
                                                    <div className="media">
                                                        <div className="pr-10">
                                                            <i className="icon wb-chat bg-orange-600 white icon-circle" aria-hidden="true" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="media-heading">Message received</h6>
                                                            <time className="media-meta" dateTime="2017-06-10T12:34:48+08:00">3 days ago</time>
                                                        </div>
                                                    </div>
                                                </a>*/}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropdown-menu-footer">
                                        <a className="dropdown-menu-footer-btn" href="javascript:void(0)" role="button">
                                            <i className="icon md-settings" aria-hidden="true" />
                                        </a>
                                        <a className="dropdown-item" href="javascript:void(0)" role="menuitem">
                                            All notifications
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <Link  to="/logout" className="nav-link" >
                                    <span className="fa fa-sign-out" />
                                </Link>
                            </li>
                        </ul>
                        {/* End Navbar Toolbar Right */}
                    </div>
                    {/* End Navbar Collapse */}
                    {/* Site Navbar Seach */}
                    <div className="collapse navbar-search-overlap" id="site-navbar-search">
                        <form role="search">
                            <div className="form-group">
                                <div className="input-search">
                                    <i className="input-search-icon wb-search" aria-hidden="true" />
                                    <input type="text" className="form-control" name="site-search" placeholder="Search..." />
                                    <button type="button" className="input-search-close icon wb-close" data-target="#site-navbar-search" data-toggle="collapse" aria-label="Close" />
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* End Site Navbar Seach */}
                </div>
            </nav>) :(<div></div>)}
    
      </div>
    );
  }
}

export default App;