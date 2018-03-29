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
            usedeadline: '',

            deal604: {
              lender: '',
              borrower: '',
              itemdata: '',
              keepcondition: '',
              usecondition: '',
              additional: '',
              giveawaydeadline: ''
            },
            reason: '',
            open1: false,
            status: ''
        }
        this.deal604 = this.deal604.bind(this)
        this.changeRender = this.changeRender.bind(this)
        this.updatedeal604 = this.updatedeal604.bind(this)
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
   deal604(event){
    const field = event.target.name;
    const deal604 = this.state.deal604;
    deal604[field] = event.target.value;
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
    updatedeal604(){
      const formData = `deal604=${JSON.stringify(this.state.deal604)}&deal_id=${this.props.data.deal_id}&duedate=${this.state.duedate}&usedeadline=${this.state.usedeadline}`

        axios.post('http://185.100.67.106:4040/update/updateDeal604',formData, {
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
                      <h3>Договор подряда</h3>
                    </div>
                    <div className="form-group">
                      <h4>Текущие условия сделки</h4>
                    </div>
                    <div className="form-group">
                        <h4>Ссудополучатель</h4>
                        <label className="form-control-label">{this.props.data.borrower.firstname} {this.props.data.borrower.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Ссудодатель</h4>
                        <label className="form-control-label">{this.props.data.lender.firstname} {this.props.data.lender.lastname}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("itemdata")  ? 'update_bg' : '')}>
                        <h4>Данные, позволяющие установить имущество, подлежащее передаче</h4>
                        <label className="form-control-label">{this.props.data.itemdata}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("giveawaydeadline")  ? 'update_bg' : '')}>
                        <h4>Сроки и порядок передачи имущества</h4>
                        <label className="form-control-label">{this.props.data.giveawaydeadline}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("usedeadline")  ? 'update_bg' : '')}>
                        <h4>Срок пользования имуществом</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.data.usedeadline)}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("keepcondition")  ? 'update_bg' : '')}>
                        <h4>Условия о содержании имущества</h4>
                        <label className="form-control-label">{this.props.data.keepcondition}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("usecondition")  ? 'update_bg' : '')}>
                        <h4>Условия об использовании имущества</h4>
                        <label className="form-control-label">{this.props.data.usecondition}</label>
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
                      <h3>Договор подряда</h3>
                    </div>
                    <div className="form-group">
                      <h4>Устаревшие условия сделки</h4>
                    </div>
                  {(Object.keys(this.props.olddeal).length != 0) ? (<div>
                    <div className="form-group">
                        <h4>Ссудополучатель</h4>
                        <label className="form-control-label">{this.props.olddeal.borrower.firstname} {this.props.olddeal.borrower.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Ссудодатель</h4>
                        <label className="form-control-label">{this.props.olddeal.lender.firstname} {this.props.olddeal.lender.lastname}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Данные, позволяющие установить имущество, подлежащее передаче</h4>
                        <label className="form-control-label">{this.props.olddeal.itemdata}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Сроки и порядок передачи имущества</h4>
                        <label className="form-control-label">{this.props.olddeal.giveawaydeadline}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Срок пользования имуществом</h4>
                        <label className="form-control-label">{this.dateFormat(this.props.olddeal.usedeadline)}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Условия о содержании имущества</h4>
                        <label className="form-control-label">{this.props.olddeal.keepcondition}</label>
                    </div>
                    <div className="form-group ">
                        <h4>Условия об использовании имущества</h4>
                        <label className="form-control-label">{this.props.olddeal.usecondition}</label>
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
                           <h4>Ссудополучатель</h4>
                           <label className="form-control-label">{this.props.data.borrower.firstname} {this.props.data.borrower.lastname}</label>
                       </div>
                          </div>
                          <div className="col-md-6">
                          <div className="form-group">
                              <h4>Ссудодатель</h4>
                              <label className="form-control-label">{this.props.data.lender.firstname} {this.props.data.lender.lastname}</label>
                          </div>
                          </div>
                      </div>
                         <div className="form-group">
        <h4 className="form-control-label"  >Данные, позволяющие установить имущество, подлежащее передаче</h4>
        <input  onChange={this.deal604}  defaultValue={this.props.data.itemdata} type="text" className="form-control"  name="itemdata"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Сроки и порядок передачи имущества</h4>
        <input onChange={this.deal604}  defaultValue={this.props.data.giveawaydeadline} type="text" className="form-control" name="giveawaydeadline"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Срок пользования имуществом</h4>
            <label className="form-control-label">Текущие данные:  {this.dateFormat(this.props.data.usedeadline)}</label>
            <DatePickerInput    minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({usedeadline: jsDate})}
                                locale='ru'/>
     </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Условия о содержании имущества</h4>
        <input onChange={this.deal604}  defaultValue={this.props.data.keepcondition} type="text" className="form-control" name="keepcondition"   autoComplete="off" />
      </div>
      <div className="form-group">
        <h4 className="form-control-label"  >Условия об использовании имущества</h4>
                <input onChange={this.deal604}  defaultValue={this.props.data.usecondition} type="text" className="form-control" name="usecondition"   autoComplete="off" />

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
        <input  onChange={this.deal604} type="text" className="form-control"  defaultValue={this.props.data.additional}   name="additional"  autoComplete="off" />
      </div>
                          <div className="form-group">
                              <button className="btn btn-primary btn-block " onClick={this.updatedeal604}>Внести изменения в сделку</button>
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
