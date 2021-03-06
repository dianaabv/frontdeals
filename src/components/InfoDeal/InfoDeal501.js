import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import DealParent from '../InfoDeal/MyDealsParent'
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
            message: '',
            isChangable: true,
            duedate:'',

            deal501: {
              side1: '',
              side2: '',
              itemname1: '',
              quantity1: '',
              price1: '',
              quality1: '',
              description1: '',
              state1:'',
              itemname2: '',
              quantity2: '',
              price2: '',
              quality2: '',
              description2: '',
              state2: '',
              deadline: '',
              additional: ''
            },
            reason: '',
            open1: false,
            status: ''
        }
        this.deal501 = this.deal501.bind(this)
        this.changeRender = this.changeRender.bind(this)
        this.updatedeal501 = this.updatedeal501.bind(this)
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
   deal501(event){
    const field = event.target.name;
    const deal501 = this.state.deal501;
    deal501[field] = event.target.value;
   }
   denyDeal() {
    var deal_id=this.props.data.deal_id
    const formData = `deal_id=${deal_id}&reason=${this.state.reason}`
      axios.post('https://sdelkibackend.herokuapp.com/api/denydeal',formData,{
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
      axios.post('https://sdelkibackend.herokuapp.com/api/acceptdeal',formData,{
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
      axios.post('https://sdelkibackend.herokuapp.com/api/acceptdeal',formData,{
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
      axios.get('https://sdelkibackend.herokuapp.com/api/getdenyreason?deal_id='+deal_id,{
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
      axios.get('https://sdelkibackend.herokuapp.com/api/acceptdeny?deal_id='+deal_id,{
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
      axios.get('https://sdelkibackend.herokuapp.com/api/denydeny?deal_id='+deal_id,{
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
    updatedeal501(){
      const formData = `deal501=${JSON.stringify(this.state.deal501)}&deal_id=${this.props.data.deal_id}&duedate=${this.state.duedate}`

        axios.post('https://sdelkibackend.herokuapp.com/update/updateDeal501',formData, {
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
                      <h3>Договор мены</h3>
                    </div>
                    <div className="form-group">
                      <h4>Текущие условия сделки</h4>
                    </div>
                    <div className="form-group">
                        <h4>Сторона 1</h4>
                        <label className="form-control-label">{this.props.data.side1.firstname} {this.props.data.side1.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Сторона 2</h4>
                        <label className="form-control-label">{this.props.data.side2.firstname} {this.props.data.side1.lastname}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("itemname1")  ? 'update_bg' : '')}>
                        <h4>Наименование имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.data.itemname1}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("quantity1")  ? 'update_bg' : '')}>
                        <h4>Количество имущества, подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.data.quantity1}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("price1")  ? 'update_bg' : '')}>
                        <h4>Стоимость имущества,  подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.data.price1}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("quality1")  ? 'update_bg' : '')}>
                        <h4>Качество имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.data.quality1}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("description1")  ? 'update_bg' : '')}>
                        <h4>Характеристика имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.data.description1}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("state1")  ? 'update_bg' : '')}>
                        <h4>Cостояние имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.data.state1}</label>
                    </div>


                    <div className={"form-group " + (objKeys.includes("itemname2")  ? 'update_bg' : '')}>
                        <h4>Наименование имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.data.itemname2}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("quantity2")  ? 'update_bg' : '')}>
                        <h4>Количество имущества, подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.data.quantity2}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("price2")  ? 'update_bg' : '')}>
                        <h4>Стоимость имущества,  подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.data.price2}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("quality2")  ? 'update_bg' : '')}>
                        <h4>Качество имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.data.quality2}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("description2")  ? 'update_bg' : '')}>
                        <h4>Характеристика имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.data.description2}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("state2")  ? 'update_bg' : '')}>
                        <h4>Cостояние имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.data.state2}</label>
                    </div>

                    <div className={"form-group " + (objKeys.includes("deadline")  ? 'update_bg' : '')}>
                       <h4>Сроки и порядок обмена имуществом                            </h4>
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
                      {(this.props.dealstatus=='requested'|| this.props.dealstatus=='accepted')?(<button className="btn btn-primary btn-block " onClick={this.changeRender}>Внести изменения</button>):(<div></div>)}
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
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested_deny')?(<button className="btn btn-primary btn-block " onClick={this.acceptDeny}>Принять запрос на растожение cделки</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                      {(this.props.status=='acceptor' && this.props.acceptor_status=='requested_deny')?(<button className="btn btn-primary btn-block " onClick={this.denyDeny}>Отклонить запрос на растожение сделки</button>):(<div></div>)}
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
                      <h3>Договор мены</h3>
                    </div>
                    <div className="form-group">
                      <h4>Устаревшие условия сделки</h4>
                    </div>
                  {(Object.keys(this.props.olddeal).length != 0) ? (<div>
                    <div className="form-group">
                        <h4>Сторона 1</h4>
                        <label className="form-control-label">{this.props.olddeal.side1.firstname} {this.props.olddeal.side1.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Сторона 2</h4>
                        <label className="form-control-label">{this.props.olddeal.side2.firstname} {this.props.olddeal.side2.lastname}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Наименование имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.olddeal.itemname1}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Количество имущества, подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.olddeal.quantity1}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Стоимость имущества,  подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.olddeal.price1}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Качество имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.olddeal.quality1}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Характеристика имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.olddeal.description1}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Cостояние имущества подлежащего передаче Стороной 1</h4>
                        <label className="form-control-label">{this.props.olddeal.state1}</label>
                    </div>

                    <div className="form-group ">
                        <h4>Наименование имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.olddeal.itemname2}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Количество имущества, подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.olddeal.quantity2}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Стоимость имущества,  подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.olddeal.price2}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Качество имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.olddeal.quality2}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Характеристика имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.olddeal.description2}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Cостояние имущества подлежащего передаче Стороной 2</h4>
                        <label className="form-control-label">{this.props.olddeal.state2}</label>
                    </div>

                    <div className="form-group ">
                        <h4>Сроки и порядок обмена имуществом</h4>
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
                           <h4>Сторона 1</h4>
                           <label className="form-control-label">{this.props.data.side1.firstname} {this.props.data.side1.lastname}</label>
                       </div>
                          </div>
                          <div className="col-md-6">
                          <div className="form-group">
                              <h4>Сторона 2</h4>
                              <label className="form-control-label">{this.props.data.side2.firstname} {this.props.data.side2.lastname}</label>
                          </div>
                          </div>
                      </div>
                         <div className="form-group">
        <h4 className="form-control-label"  >Наименование имущества подлежащего передаче Стороной 1</h4>
        <input  onChange={this.deal501}  defaultValue={this.props.data.itemname1} type="text" className="form-control"  name="itemname1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Количество имущества, подлежащего передаче Стороной 1</h4>
        <input onChange={this.deal501}  defaultValue={this.props.data.quantity1} type="text" className="form-control" name="quantity1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Стоимость имущества,  подлежащего передаче Стороной 1</h4>
        <input onChange={this.deal501}  defaultValue={this.props.data.price1} type="text" className="form-control" name="price1"   autoComplete="off" />
     </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Качество имущества подлежащего передаче Стороной 1</h4>
        <input onChange={this.deal501}  defaultValue={this.props.data.quality1} type="text" className="form-control" name="quality1"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label">Характеристика имущества подлежащего передаче Стороной 1</h4>
        <input onChange={this.deal501}  defaultValue={this.props.data.description1} type="text" className="form-control" name="description1"
        autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label">Cостояние имущества подлежащего передаче Стороной 1</h4>

        <select className="form-control " name="state1" onChange={this.deal501} >
          <option selected disabled>Выберите</option>
          <option value="Б/У">Б/У</option>
          <option value="Новое">Новое</option>
        </select>
      </div>



  <div className="form-group">
      <h4 className="form-control-label"  >Наименование имущества подлежащего передаче Стороной 2</h4>
      <input  onChange={this.deal501}  defaultValue={this.props.data.itemname2} type="text" className="form-control"  name="itemname2"   autoComplete="off" />
    </div>
    <div className="form-group">
      <h4 className="form-control-label"  >Количество имущества, подлежащего передаче Стороной 2</h4>
      <input onChange={this.deal501}  defaultValue={this.props.data.quantity2} type="text" className="form-control" name="quantity2"   autoComplete="off" />
    </div>
    <div className="form-group">
      <h4 className="form-control-label"  >Стоимость имущества,  подлежащего передаче Стороной 2</h4>
      <input onChange={this.deal501}  defaultValue={this.props.data.price2} type="text" className="form-control" name="price2"   autoComplete="off" />
   </div>
    <div className="form-group">
      <h4 className="form-control-label"  >Качество имущества подлежащего передаче Стороной 2</h4>
      <input onChange={this.deal501}  defaultValue={this.props.data.quality2} type="text" className="form-control" name="quality2"   autoComplete="off" />
    </div>
    <div className="form-group">
      <h4 className="form-control-label">Характеристика имущества подлежащего передаче Стороной 2</h4>
              <input onChange={this.deal501}  defaultValue={this.props.data.description2} type="text" className="form-control" name="description2"   autoComplete="off" />

    </div>
    <div className="form-group">
      <h4 className="form-control-label">Cостояние имущества подлежащего передаче Стороной 2</h4>
      <select className="form-control "  name="state2" onChange={this.deal501} >
        <option selected disabled>Выберите</option>
        <option value="Б/У">Б/У</option>
        <option value="Новое">Новое</option>
      </select>

    </div>



    <div className="form-group">
  <h4 className="form-control-label">Сроки и порядок обмена имуществом</h4>
<input onChange={this.deal501}  defaultValue={this.props.data.deadline} type="text" className="form-control" name="deadline"   autoComplete="off" />

    </div>

            <div className="form-group">
        <h4 className="form-control-label"  >Срок действия договора</h4>
         <label className="form-control-label">Текущие данные:  {this.dateFormat(this.props.data.duedate)}</label>
            <DatePickerInput    minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
      </div>
       <div className="form-group">
        <h4 className="form-control-label"  >Дополнительные условия (не обязательное ус-ие)                            </h4>
        <input  onChange={this.deal501} type="text" className="form-control"  defaultValue={this.props.data.additional}   name="additional"  autoComplete="off" />
      </div>
                          <div className="form-group">
                              <button className="btn btn-primary btn-block " onClick={this.updatedeal501}>Внести изменения в сделку</button>
                          </div>
                          <div className="form-group">
                              <button className="btn btn-primary btn-block " onClick={this.changeRender}>Отменить изменения</button>
                          </div>
                      </div>
                  </div>
        </div>

      )}

</div>
        );
    }
}

export default MyDealsParent;
