// src/components/About/index.js
import React  from 'react';
import axios from 'axios';
import Deal406 from './406Deal';
import Deal501 from './501Deal';
import Deal506 from './506Deal';
import Deal540 from './540Deal';
import Deal604 from './604Deal';
import Deal616 from './616Deal';
import Deal683 from './683Deal';
import Deal688 from './688Deal';
import Deal768 from './768Deal';
import Deal846 from './846Deal';
import Deal715 from './715Deal';
import Deal865 from './865Deal';
import InputElement from 'react-input-mask';
import './style.css';

 class Deals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deals: [],
      users: [],
      lawid: '',
      userid: ''
    }
    this.hangeDealType=this.hangeDealType.bind(this)
    this.hangeDealUser=this.hangeDealUser.bind(this)
    this.updateDeal=this.updateDeal.bind(this)
  }
  componentDidMount() {
      axios.get('http://185.100.67.106:4040/api/getalldeals',{
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'}
  })
      .then(res => {
          this.setState({
           deals: res.data.deals
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
  hangeDealType(event){
    this.setState({
      lawid: event.target.value
    })
  }
  hangeDealUser(event){
    this.setState({
      userid: event.target.value
    })
  }
  updateDeal() {
    console.log(this.state.lawid, this.state.userid)

  }

  render() {
    return (
 
                <div className="page">
                    <div className="page-content container-fluid">
                        <div className="panel">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="panel-title-icon icon fa-gears" aria-hidden="true" />Создать Сделку</h3>
                            </div>
                            <div className="panel-body container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <p>Заключите сделку прямо сейчас.</p>
                                    </div>
                                </div>
                                <div className="row"> 
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="form-control-label" htmlFor="citySelectorAddShopForm">Выберите тип договора</label>    
                                             {
                                            this.state.deals.length!=0 ?
                                            (      <select id="citySelectorAddShopForm" className="form-control" onChange={this.hangeDealType}>
                                            <option value=''>Выберите тип сделки</option>
                                            {this.state.deals.map((deal, s) =>
                                              <option key={s} value={deal.lawid}>{deal.name}</option>
                                            )}
                                            </select>) : 
                                            ( <select id="citySelectorAddShopForm" className="form-control">
                                            <option value=''>Сделок не найдено</option>
                                            </select>
                                            )
                                          }
                                      </div>
                                  </div>
                               {/* <div className="col-md-4">
                                    <div className="form-group">
                                      <label className="form-control-label" htmlFor="citySelectorAddShopForm">Выберите контрагента</label>
                                          {
                                                    this.state.users.length!=0 ?
                                                    (      <select id="citySelectorAddShopForm" className="form-control" onChange={this.hangeDealUser}>
                                                    <option value=''>Выберите контрагента</option>
                                                    {this.state.users.map((user, s) =>
                                                      <option key={s} value={user._id}>{user.firstname} {user.lastname}</option>
                                                    )}
                                                    </select>) : 
                                                    ( <select id="citySelectorAddShopForm" className="form-control">
                                                    <option value=''>Контрагентов не найдено</option>
                                                    </select>
                                                    )
                                                  }
                                    </div>      
                                  </div>*/}
                                  {/*
                                  <div className="col-md-4">
                                   <div className="form-group">
                                            <label className="form-control-label"><br/></label>
                                            <button   type="button" onClick={this.updateDeal} className="btn btn-primary btn-block btn-round">Продолжить</button>
                                    </div>
                                  </div>*/}

                                  </div>
                            </div>
                        </div>
  <div className="col-lg-12 col-md-10 panel panel-info panel-line" style={{margin: 'auto'}}>

                            <div className="panel-heading">
                                <h3 className="panel-title">Cоздание сделки </h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    
                                        {
                                                    (this.state.lawid=='406' )?
                                                    (<Deal406 />  ) :
                                                    (this.state.lawid=='501') ?
                                                    (<Deal501 />) :
                                                    (this.state.lawid=='506') ?
                                                    (<Deal506 />)  :
                                                    (this.state.lawid=='540') ?
                                                    (<Deal540 />) :
                                                    (this.state.lawid=='604') ?
                                                    (<Deal604 />) : 
                                                    (this.state.lawid=='616') ?
                                                    (<Deal616 />) :
                                                    (this.state.lawid=='683') ?
                                                    (<Deal683 />) :
                                                    (this.state.lawid=='688') ?
                                                    (<Deal688 />) :
                                                    (this.state.lawid=='768') ?
                                                    (<Deal768 />) :
                                                    (this.state.lawid=='846') ?
                                                    (<Deal846 />) :
                                                    (this.state.lawid=='715') ?
                                                    (<Deal715 />) :
                                                    (this.state.lawid=='865') ?
                                                    (<Deal865 />)
                                                     : 
                                                    ( 
                                                      <p>Вы ничего не выбрали</p>
                                                    )
                                                  }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    );
  }
}export default Deals;