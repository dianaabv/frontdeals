import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Auth from '../modules/Auth'
import './style.css';

class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { className, ...props } = this.props;
    return (
        <div>
           {(Auth.isUserAuthenticated())?(
      <div className="site-menubar site-menubar-light">
        <div>
                <div className="site-menubar-body">
                    <ul className="site-menu" data-plugin="menu" style={{transform: 'translate3d(0px, -82.0631px, 0px)'}}>
        {/*              <li className="site-menu-item has-sub margtop" >
                          <Link className="animsition-link" to="/dashboard">
                              <i className="site-menu-icon fa fa-user-o" aria-hidden="true" />
                              <span className="site-menu-title">Личный<br/>кабинет</span>
                          </Link>
                      </li>*/}
                        <li className="site-menu-item has-sub margtop">
                            <a href="javascript:void(0)">
                                <i className="site-menu-icon fa fa-handshake-o" aria-hidden="true" />
                                <span className="site-menu-title">Сделки</span>
                            </a>
                            <ul className="site-menu-sub">
                                <li className="site-menu-item">
                                    <Link className="animsition-link" to="/deals">
                                        <span className="site-menu-title">Cоздать сделку</span>
                                    </Link>
                                </li>
                                <li className="site-menu-item">
                                    <Link className="animsition-link" to="/mydeals">
                                        <span className="site-menu-title">Текущие сделки</span>
                                    </Link>
                                </li>
                                <li className="site-menu-item">
                                    <Link className="animsition-link" to="/finisheddeals">
                                        <span className="site-menu-title">Завершеные сделки</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="site-menu-item has-sub">
                            <a href="javascript:void(0)">
                                <i className="site-menu-icon fa fa-users" aria-hidden="true" />
                                <span className="site-menu-title">Контакты</span>
                            </a>
                            <ul className="site-menu-sub">
                                <li className="site-menu-item">
                                    <Link className="animsition-link" to="/addkontragents">
                                        <span className="site-menu-title">Добавить контрагента</span>
                                    </Link>
                                </li>
                                <li className="site-menu-item">
                                    <Link className="animsition-link" to="/mykontragents">
                                        <span className="site-menu-title">Мои контакты</span>
                                    </Link>
                                </li>
                                <li className="site-menu-item">
                                    <Link className="animsition-link" to="/kontragentrequest">
                                        <span className="site-menu-title">Мои заявки</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                     {/*   <li className="site-menu-item has-sub">
                                                 <Link className="animsition-link" to="/mykontragents">
                                                     <i className="site-menu-icon fa fa-users" aria-hidden="true" />
                                                     <span className="site-menu-title">Мои Контакты</span>
                                                 </Link>
                                             </li>*/}
                        <li className="site-menu-item has-sub">
                            <Link to="/dealhistory">
                                <i className="site-menu-icon fa-history" aria-hidden="true" />
                                <span className="site-menu-title">История <br/>сделок</span>
                            </Link>
                        </li>
                        <li className="site-menu-item has-sub">
                            <Link to="/settings">
                                <i className="site-menu-icon fa fa-cogs" aria-hidden="true" />
                                <span className="site-menu-title">Настройки</span>
                            </Link>
                        </li>
                    { /*   <li className="site-menu-item has-sub">
                            <a href="/#/news">
                                <i className="site-menu-icon fa-inbox" aria-hidden="true" />
                                <span className="site-menu-title">Уведомления</span>
                            </a>
                        </li>*/}
                    </ul>
                </div>
            </div>
        </div>):(<div></div>)}

      </div>
    );
  }
}

export default App;
