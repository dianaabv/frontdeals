import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
//calendar
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import swal from 'sweetalert'
import Modal from 'react-responsive-modal';

import jwtDecode from 'jwt-decode';
class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isChangable: true,
            duedate: '',
            loanterm: '',
            deal715: {
              giver: '',
              borrower: '',
              loanamount: '',
              awardamount: '',
              additional: '',
              deadline: ''
            },
            reason: '',
            open1: false,
            status: ''
        }
        this.deal715 = this.deal715.bind(this)
        this.changeRender=this.changeRender.bind(this)
        this.updateDeal517 = this.updateDeal517.bind(this)
        this.acceptDeal = this.acceptDeal.bind(this)
        this.acceptDealIp = this.acceptDealIp.bind(this)
        this.denyDeal = this.denyDeal.bind(this)
        this.acceptDeny = this.acceptDeny.bind(this)
        this.denyDeny = this.denyDeny.bind(this)
        this.getDenyReason = this.getDenyReason.bind(this)
        this.dateFormat=this.dateFormat.bind(this); 
      
    }
    componentWillMount(){
      var token = Auth.getToken();
      var decoded = jwtDecode(token);
      this.setState({
        status: decoded.userstatus
      });
    }
   deal715(event){
    const field = event.target.name;
    const deal715 = this.state.deal715;
    deal715[field] = event.target.value;
   }
   acceptDeal(){
      var deal_id=this.props.data.deal_id
      axios.get('http://185.100.67.106:4040/api/acceptdeal?deal_id='+deal_id,{
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



    changeRender(){
        this.setState({
            isChangable:  !this.state.isChangable
        })
    }
    updateDeal517(){
            const formData = `deal715=${JSON.stringify(this.state.deal715)}&deal_id=${this.props.data.deal_id}&duedate=${this.state.duedate}&loanterm=${this.state.loanterm}`

      console.log(this.state.deal715)
        axios.post('http://185.100.67.106:4040/update/updateDeal715',formData, {
            responseType: 'json',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': `bearer ${Auth.getToken()}`
            }
        })
        .then(res => {
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

    dateFormat(date){
      var fDate = new Date(date);
      var m = ((fDate.getMonth() * 1 + 1) < 10) ? ("0" + (fDate.getMonth() * 1 + 1)) : (fDate.getMonth() * 1 + 1);
      var d = ((fDate.getDate() * 1) < 10) ? ("0" + (fDate.getDate() * 1)) : (fDate.getDate() * 1);
      return d + "/" + m + "/" + fDate.getFullYear()
    }
      acceptDealIp(){
    this.setState({
      status: 'Индивидуальный предприниматель'
    })
    var deal_id=this.props.data.deal_id
    const formData = `deal_id=${deal_id}&status=${this.state.status}`
      axios.post('http://185.100.67.106:4040/api/acceptdeal',formData,{
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
   acceptDeal(){
      // console.log(this.state.status)
      var deal_id=this.props.data.deal_id
      const formData = `deal_id=${deal_id}&status=${'Физическое Лицо'}`
      axios.post('http://185.100.67.106:4040/api/acceptdeal',formData,{
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
    denyDeal() {
    var deal_id=this.props.data.deal_id
    const formData = `deal_id=${deal_id}&reason=${this.state.reason}`
      axios.post('http://185.100.67.106:4040/api/denydeal',formData,{
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
      acceptDeny(){
    var deal_id=this.props.data.deal_id
      axios.get('http://185.100.67.106:4040/api/acceptdeny?deal_id='+deal_id,{
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
      denyDeny(){
    var deal_id=this.props.data.deal_id
      axios.get('http://185.100.67.106:4040/api/denydeny?deal_id='+deal_id,{
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
      getDenyReason(){
    var deal_id=this.props.data.deal_id
      axios.get('http://185.100.67.106:4040/api/getdenyreason?deal_id='+deal_id,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           message: res.data.message
          });
          swal({title: "Причина отмены сделки контрагента: ", text: this.state.message})
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


    render() {
      const today=new Date();
      today.setDate(today.getDate() + 1)
      function compareDeals(new_deal, old_deal) {
        return Object.keys(new_deal).reduce(function(map1, k){
        if(new_deal[k]!=old_deal[k]) {
          map1[k]=old_deal[k];
        }
        return map1;
        }, {})
      } 
      var z = compareDeals(this.props.olddeal, this.props.data)
      var objKeys=Object.keys(z)
      return (
       <div>
       {(this.state.isChangable=='1')?(
          <div className="panel-body">
            <div className="row">
            <div className="col-md-6">
                <div className="col-md-12">
                    <div className="form-group">
                      <h3>Договор займа</h3>
                    </div>
                    <div className="form-group">
                      <h3>Текущие условия сделки</h3>
                    </div>
                    <div className="form-group">
                        <h4>Заимодатель</h4>
                        <label className="form-control-label">{this.props.data.giver.firstname} {this.props.data.giver.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Заемщик</h4>
                        <label className="form-control-label">{this.props.data.borrower.firstname} {this.props.data.borrower.lastname}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("loanamount")  ? 'update_bg' : '')}>
                        <h4>Cумма займа*</h4>
                        <label className="form-control-label">{this.props.data.loanamount}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("loanterm")  ? 'update_bg' : '')}>
                        <h4>Срок займа</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.data.loanterm)}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("awardamount")  ? 'update_bg' : '')}>
                        <h4>Размер вознаграждения</h4>
                        <label className="form-control-label">{this.props.data.awardamount}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("deadline")  ? 'update_bg' : '')}>
                        <h4>Сроки и порядок выплаты вознаграждения:</h4>
                        <label className="form-control-label">{this.props.data.deadline}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("duedate")  ? 'update_bg' : '')}>
                        <h4>Срок действия договора</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.data.duedate)}</label>
                    </div>
                     <div className={"form-group " + (objKeys.includes("additional")  ? 'update_bg' : '')}>
                        <h4>Дополнительные условия (не обязательное ус-ие)                            </h4>
                        <label className="form-control-label">{this.props.data.additional}</label>
                    </div>

                    <div className="form-group">
                        {(this.props.status=='acceptor' && this.props.acceptor_status=='requested')?(<button className="btn btn-primary btn-block " onClick={this.acceptDeal}>Принять текущие условия сделки</button>):(<div></div>)}
                    </div>
                    {(this.props.create_as_ip.length==0)?(
                      <div>
                    <div className="form-group">
                        {(this.props.status=='acceptor' && this.props.acceptor_status=='requested')?(<button className="btn btn-success btn-block " onClick={this.acceptDeal}>Принять текущие условия сделки как <b className='my_weight'>Физ. лицо</b></button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested' && this.state.status=='Индивидуальный предприниматель')?(<button className="btn btn-success btn-block " onClick={this.acceptDealIp}>Принять текущие условия сделки как <b className='my_weight'>ИП</b></button>):(<div></div>)}
                    </div>
                    </div>
                    ):(
                    <div>
                    {(this.props.create_as_ip=='accept_as_ip')?(
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested' && this.state.status=='Индивидуальный предприниматель' && this.props.create_as_ip=='accept_as_ip')?(<button className="btn btn-success btn-block " onClick={this.acceptDealIp}>Принять текущие условия сделки как <b className='my_weight'> ИП </b></button>):(<div></div>)}
                    </div>):(
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested')?(<button className="btn btn-success btn-block " onClick={this.acceptDeal}>Принять текущие условия сделки как <b className='my_weight'> Физ. лицо </b></button>):(<div></div>)}
                    </div>
                    )}
                    </div>

                    )}
                
                    <div className="form-group">
                      {(this.props.dealstatus=='requested')?(<button className="btn btn-primary btn-block " onClick={this.changeRender}>Внести изменения</button>):(<div></div>)}
                    </div>
                   <div className="form-group">
                      {(this.props.dealstatus=='accepted')?(<button className="btn btn-primary btn-block " onClick={this.onOpenModal} >Досрочное расторжение договора</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.dealstatus=='requested')?(<button className="btn btn-primary btn-block " onClick={this.denyDeal} >Отклонить сделку</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested_deny')?(<button className="btn btn-primary btn-block " onClick={this.getDenyReason}>Просмотреть причину отмены сделки</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested_deny')?(<button className="btn btn-primary btn-block " onClick={this.acceptDeny}>Принять запрос на отклонение cделки</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested_deny')?(<button className="btn btn-primary btn-block " onClick={this.denyDeny}>Отклонить запрос на отклонение сделки</button>):(<div></div>)}
                    </div>
                    <Modal open={this.state.open1} onClose={this.onCloseModal} little>
                      <h2>Расторжение сделки</h2>
                      <div className="form-group">
                        <h4 className="form-control-label"  >Укажите причину по которой вы хотите аннулировать сделку.</h4>
                        <input  onChange={(event)=>{
                                    this.setState({reason: event.target.value})
                                    }}  type="text" className="form-control"   name="order"   autoComplete="off" />
                      </div>
                      <button className="btn btn-primary btn-block "onClick={this.denyDeal}>Подтвердить</button>
                    </Modal>
                </div>
              </div>
              <div className="col-md-6 update_bg_grey">
                <div className="col-md-12">
                    <div className="form-group">
                      <h3>Договор займа</h3>
                    </div>
                    <div className="form-group">
                      <h3>Устаревшие условия сделки</h3>
                    </div>
                    {(Object.keys(this.props.olddeal).length != 0) ? (<div>
                       <div className="form-group">
                        <h4>Заимодатель</h4>
                        <label className="form-control-label"> {this.props.olddeal.giver.firstname} {this.props.olddeal.giver.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Заемщик</h4>
                        <label className="form-control-label">{this.props.olddeal.borrower.firstname} {this.props.olddeal.borrower.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Cумма займа*</h4>
                        <label className="form-control-label">{this.props.olddeal.loanamount}</label>
                    </div>
                    <div className="form-group">
                        <h4>Срок займа</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.olddeal.loanterm)}</label>
                    </div>
                    <div className="form-group">
                        <h4>Размер вознаграждения</h4>
                        <label className="form-control-label">{this.props.olddeal.awardamount}</label>
                    </div>
                    <div className="form-group">
                        <h4>Сроки и порядок выплаты вознаграждения</h4>
                        <label className="form-control-label">{this.props.olddeal.deadline}</label>
                    </div>
                    <div className="form-group">
                        <h4>Срок действия договора</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.olddeal.duedate)}</label>
                    </div>
                    <div className="form-group">
                        <h4>Дополнительные условия (не обязательное ус-ие)                            </h4>
                        <label className="form-control-label">{this.props.olddeal.additional}</label>
                    </div>

                      </div>) :(<h1>пока нет изменений</h1>)}
                </div>
              </div>
            </div>
        </div>
       
):(<div className="panel-body">
         <div className="row">
                      <div className="col-md-12">
                      <div className="row">
                       <div className="col-md-6">
        
                          <div className="form-group">
                              <h4>Заимодатель</h4>
                              <label className="form-control-label">{this.props.data.giver.firstname} {this.props.data.giver.lastname}</label>    
                          </div>
                          </div>
                          <div className="col-md-6">
                          <div className="form-group">
                              <h4>Заемщик</h4>
                              <label className="form-control-label">{this.props.data.borrower.firstname} {this.props.data.borrower.lastname}</label>
                          </div>
                          </div>
                      </div>
                          <div className="form-group">
                              <h4>Cумма займа</h4>
                              <input type="text" defaultValue={this.props.data.loanamount} name='loanamount' onChange={this.deal715} className="form-control" />
                          </div>
                          <div className="form-group">
                              <h4>Срок займа</h4>
                                <label className="form-control-label">Текущие данные:  {this.dateFormat(this.props.data.loanterm)}</label>
                                <DatePickerInput
                                      minDate={today}
                                      className='my-react-datepicker'
                                      value={this.props.value}
                                      onChange={(jsDate) => this.setState({loanterm: jsDate})}
                                      locale='ru'/>
                          </div>
                               <div className="form-group">
                              <h4>Размер вознаграждения</h4>
                              <input type="text" defaultValue={this.props.data.awardamount} name='awardamount' onChange={this.deal715} className="form-control"    />
                          </div>
                            <div className="form-group">
                              <h4>Сроки и порядок выплаты вознаграждения</h4>
                              <input type="text" defaultValue={this.props.data.deadline} name='deadline' onChange={this.deal715}className="form-control"  />
                          </div>
                     
                          <div className="form-group">
                              <h4>Дополнительные условия (не обязательное ус-ие)                            </h4>
                              <input type="text" defaultValue={this.props.data.additional} name='additional' onChange={this.deal715}className="form-control"   />
                          </div>
                          <div className="form-group">
                              <h4>Срок действия договора</h4>
                              <label className="form-control-label">Текущие данные: {this.dateFormat(this.props.data.duedate)}</label>
                               <DatePickerInput
                                      minDate={today}
                                      className='my-react-datepicker'
                                      value={this.props.value}
                                      onChange={(jsDate) => this.setState({duedate: jsDate})}
                                      locale='ru'/>
                          </div>
                          <div className="form-group">
                              <button className="btn btn-primary btn-block " onClick={this.updateDeal517}>Внести изменения в сделку</button>
                          </div>
                          <div className="form-group">
                              <button className="btn btn-primary btn-block " onClick={this.changeRender}>Отменить изменения</button>
                          </div>
                      </div>
                  </div>
        </div>)}
</div>
        );
    }
}

export default MyDealsParent;
