import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
//calendar
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import swal from 'sweetalert'
import jwtDecode from 'jwt-decode';
import Modal from 'react-responsive-modal';

class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           //deals: [],
            message: '',
            isChangable: true,
            shelfdate: '',
            payday: '',
            duedate: '',
            deal768:{
              keeper: '',
              bailor: '',
              itemname: '',
              awardamount: '',
              responsibility: '',
              additional: ''
            },
            reason: '',
            open1: false,
            status: ''
        }
        this.deal768 = this.deal768.bind(this)
        this.changeRender = this.changeRender.bind(this)
        this.updateDeal768 = this.updateDeal768.bind(this)
        this.acceptDeal = this.acceptDeal.bind(this)
        this.acceptDealIp = this.acceptDealIp.bind(this)
        this.denyDeal = this.denyDeal.bind(this)
        this.acceptDeny = this.acceptDeny.bind(this)
        this.denyDeny = this.denyDeny.bind(this)
        this.getDenyReason = this.getDenyReason.bind(this)
        this.dateFormat=this.dateFormat.bind(this); 
    }
   // componentDidMount() {
   //    var deal_id=this.props.data[0].deal_id
   // }
  componentWillMount(){
    var token = Auth.getToken();
    var decoded = jwtDecode(token);
    this.setState({
      status: decoded.userstatus
    });
  }
   deal768(event){
    const field = event.target.name;
    const deal768 = this.state.deal768;
    deal768[field] = event.target.value;
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
     onOpenModal = () => {
    this.setState({ open1: true });
  };
 
  onCloseModal = () => {
    this.setState({ open1: false });
  };
 

    changeRender(){
        this.setState({
            isChangable:  !this.state.isChangable
        })
    }
    updateDeal768(){
      const formData = `deal768=${JSON.stringify(this.state.deal768)}&deal_id=${this.props.data.deal_id}&duedate=${this.state.duedate}&payday=${this.state.payday}&shelfdate=${this.state.shelfdate}`
        axios.post('http://185.100.67.106:4040/update/updateDeal768',formData, {
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
                      <h3>Договор хранения</h3>
                    </div>
                    <div className="form-group">
                      <h4>Текущие условия сделки</h4>
                    </div>
                    <div className="form-group">
                        <h4>Хранитель</h4>
                        <label className="form-control-label">{this.props.data.keeper.firstname} {this.props.data.keeper.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Поклажедатель</h4>
                        <label className="form-control-label">{this.props.data.bailor.firstname} {this.props.data.bailor.lastname}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("itemname")  ? 'update_bg' : '')}>
                        <h4>Вещь, передаваемая на хранение</h4>
                        <label className="form-control-label">{this.props.data.itemname}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("shelfdate")  ? 'update_bg' : '')}>
                        <h4>Срок хранения</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.data.shelfdate)}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("awardamount")  ? 'update_bg' : '')}>
                        <h4>Вознаграждение и возмещение расходов хранителю</h4>
                        <label className="form-control-label">{this.props.data.awardamount}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("payday")  ? 'update_bg' : '')}>
                        <h4>Сроки и порядок оплаты </h4>
                        <label className="form-control-label">{this.dateFormat(this.props.data.payday)}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("responsibility")  ? 'update_bg' : '')}>
                        <h4>Ответственность за несохранность</h4>
                        <label className="form-control-label">{this.props.data.responsibility}</label>
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
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested')?(<button className="btn btn-primary btn-block " onClick={this.acceptDeal}>Принять текущие условия сделки как Физ. лицо</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested' && this.state.status=='Индивидуальный предприниматель')?(<button className="btn btn-primary btn-block " onClick={this.acceptDealIp}>Принять текущие условия сделки как ИП</button>):(<div></div>)}
                    </div>
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
                        <h4 className="form-control-label" htmlFor="inputNameAddShop">Укажите причину по которой вы хотите аннулировать сделку.</h4>
                        <input  onChange={(event)=>{
                                    this.setState({reason: event.target.value})
                                    }}  type="text" className="form-control" id="inputNameAddShop" name="order"   autoComplete="off" />
                      </div>
                      <button className="btn btn-primary btn-block "onClick={this.denyDeal}>Подтвердить</button>
                    </Modal>
                </div>
              </div>
              <div className="col-md-6 update_bg_grey">
                <div className="col-md-12">
                    <div className="form-group">
                      <h3>Договор хранения</h3>
                    </div>
                    <div className="form-group">
                      <h4>Устаревшие условия сделки</h4>
                    </div>
                  {(Object.keys(this.props.olddeal).length != 0) ? (<div>
                          <div className="form-group">
                           <h4>Хранитель</h4>
                           <label className="form-control-label">{this.props.olddeal.keeper.firstname} {this.props.olddeal.keeper.lastname}</label>
                       </div>
                       <div className="form-group">
                           <h4>Поклажедатель</h4>
                           <label className="form-control-label">{this.props.olddeal.bailor.firstname} {this.props.olddeal.bailor.lastname}</label>
                       </div>
                       <div className="form-group">
                           <h4>Вещь, передаваемая на хранение</h4>
                           <label className="form-control-label">{this.props.olddeal.itemname}</label>
                       </div>
                       <div className="form-group">
                           <h4>Срок хранения</h4>
                           <label className="form-control-label">{this.dateFormat(this.props.olddeal.shelfdate)}</label>
                       </div>
                       <div className="form-group">
                           <h4>Вознаграждение и возмещение расходов хранителю</h4>
                           <label className="form-control-label">{this.props.olddeal.awardamount}</label>
                       </div>
                       <div className="form-group">
                           <h4>Сроки и порядок оплаты </h4>
                           <label className="form-control-label">{this.dateFormat(this.props.olddeal.payday)}</label>
                       </div>
                       <div className="form-group">
                           <h4>Ответственность за несохранность</h4>
                           <label className="form-control-label">{this.props.olddeal.responsibility}</label>
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
                              <h4>Хранитель</h4>
                           <label className="form-control-label">{this.props.data.keeper.firstname} {this.props.data.keeper.lastname}</label>
                          </div>
                          </div>
                          <div className="col-md-6">
                          <div className="form-group">
                              <h4>Поклажедатель</h4>
                        <label className="form-control-label">{this.props.data.bailor.firstname} {this.props.data.bailor.lastname}</label>
                          </div>
                          </div>
                      </div>
                         <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Вещь, передаваемая на хранение</h4>
        <input  onChange={this.deal768}  defaultValue={this.props.data.itemname} type="text" className="form-control"  name="itemname"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Срок хранения</h4>
        <label className="form-control-label">Текущие данные:  {this.dateFormat(this.props.data.shelfdate)}</label>
         <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({shelfdate: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Вознаграждение и возмещение расходов хранителю </h4>
           <input onChange={this.deal768}  defaultValue={this.props.data.awardamount} type="number" className="form-control" name="awardamount"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Сроки и порядок оплаты</h4>
        <label className="form-control-label">Текущие данные:  {this.dateFormat(this.props.data.payday)}</label>
            <DatePickerInput
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({payday: jsDate})}
                                locale='ru'/>
      </div>
      <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Ответственность за несохранность</h4>
        <input  onChange={this.deal768}  defaultValue={this.props.data.responsibility} type="text" className="form-control" name="responsibility"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Срок действия договора</h4>
         <label className="form-control-label">Текущие данные:  {this.dateFormat(this.props.data.duedate)}</label>
            <DatePickerInput    minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
       <div className="form-group">
        <h4 className="form-control-label" htmlFor="inputNameAddShop">Дополнительные условия (не обязательное ус-ие)                            </h4>
        <input  onChange={this.deal768} type="text" className="form-control"  defaultValue={this.props.data.additional} id="inputNameAddShop" name="additional"  autoComplete="off" />
      </div>
                          <div className="form-group">
                              <button className="btn btn-primary btn-block " onClick={this.updateDeal768}>Внести изменения в сделку</button>
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
