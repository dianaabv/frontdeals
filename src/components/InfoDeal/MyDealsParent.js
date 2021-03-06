import './style.css';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import InfoDeal506 from './InfoDeal506'
import InfoDeal715 from './InfoDeal715'
import InfoDeal865 from './InfoDeal865'
import InfoDeal768 from './InfoDeal768'
import InfoDeal688 from './InfoDeal688'
import InfoDeal616 from './InfoDeal616'
import InfoDeal683 from './InfoDeal683'
import InfoDeal604 from './InfoDeal604'
import InfoDeal540 from './InfoDeal540'
import InfoDeal501 from './InfoDeal501'
import InfoDeal846 from './InfoDeal846'
import InfoDeal406 from './InfoDeal406'
import Satisfied from './Satisified'


import swal from 'sweetalert'




class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          satisfied:false,
          satisfied_deal_id:'',
            deals: [],
            deal: {},
            userId:'',
            lawid: '',
            dealstatus: '',
            acceptor_status:'',
            initiator_status: '',
            dealstatus: '',
            status: '',
            olddeal: {},
            create_as_ip: '',


            // dealSat:{
            //   ans: '',
            //   reason:''
            // }

        },
        this.dealRedirects=this.dealRedirects.bind(this)
        this.createPdf = this.createPdf.bind(this)
        this.dateFormat=this.dateFormat.bind(this);
        this.dealSatisfied = this.dealSatisfied.bind(this)
    //    this.dealSat = this.dealSat.bind(this)
        //this.privet=this.privet.bind(this)

    }
    componentDidMount() {
      const { match: { params } } = this.props;
      if(params.deal_id){
        // console.log(params.deal_id)
        // console.log(params.lawid)
        this.setState({
          deal :{},
          acceptor_status: '',
          dealstatus: '',
          status: '',
          olddeal: {},
          create_as_ip: ''
        })
        this.getinfodeal(params.lawid,params.deal_id)
        this.getmystatus(params.deal_id)
        this.getolddeal(params.lawid, params.deal_id)
      }
      // else{
      //   this.setState({
      //     deal :{},
      //     acceptor_status: '',
      //     dealstatus: '',
      //     status: '',
      //     olddeal: {},
      //     create_as_ip: ''
      //   })
      //   this.getmystatus(params.deal_id)
      // }

     // this.privet()
        axios.get('https://sdelkibackend.herokuapp.com/api/getmydeals',{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
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
    // privet(){
    //   console.log('ok')
    // }
    dateFormat(date){
      var fDate = new Date(date);
      var m = ((fDate.getMonth() * 1 + 1) < 10) ? ("0" + (fDate.getMonth() * 1 + 1)) : (fDate.getMonth() * 1 + 1);
      var d = ((fDate.getDate() * 1) < 10) ? ("0" + (fDate.getDate() * 1)) : (fDate.getDate() * 1);
      return d + "/" + m + "/" + fDate.getFullYear()
    }
    createPdf(event){
      const formData = `lawid=${event.target.name}&dealid=${event.target.value}`;
      axios.post('https://sdelkibackend.herokuapp.com/pdf/createpdf',formData, {
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
            swal({text: this.state.message})
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
    getinfodeal(lawid, dealid){
      const formData = `lawid=${lawid}&dealid=${dealid}`;
        //console.log(formData, 'formData')
        axios.post('https://sdelkibackend.herokuapp.com/api/getinfodeal',formData, {
            responseType: 'json',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => {
            this.setState({
                deal: res.data.deal
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
    getmystatus(dealid){
      axios.get('https://sdelkibackend.herokuapp.com/api/getmystatus?deal_id='+dealid,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           status: res.data.status,
           dealstatus: res.data.dealstatus,
           acceptor_status: res.data.acceptor_status,
           create_as_ip: res.data.create_as_ip,
           initiator_status: res.data.initiator_status
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
    getolddeal(lawid, dealid){
      const formData = `lawid=${lawid}&dealid=${dealid}`;
      axios.post('https://sdelkibackend.herokuapp.com/api/getolddeal', formData, {
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           olddeal: res.data.olddeal
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
    dealRedirects(event){
      this.setState({
       deal :{},
       acceptor_status: '',
       dealstatus: '',
       status: '',
       olddeal: {},
       create_as_ip: ''
      })
      this.getinfodeal(event.target.name, event.target.value)
      this.getmystatus(event.target.value)
      this.getolddeal(event.target.name, event.target.value)
    }
    dealSatisfied(event){
      // if(this.state.satisfied==1){
  this.setState({satisfied_deal_id: event.target.value})
          const formData = `deal_id=${event.target.value}`;
          axios.post('https://sdelkibackend.herokuapp.com/api/needfinalsubmission', formData, {
            responseType: 'json',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
              'Authorization': `bearer ${Auth.getToken()}`
          }
          }).then(res => {
            // console.log(res.data)
            // this.setState({ satisfied:!this.state.satisfied})
            if(res.data.message.length!=0){
              swal(res.data.message)
            } else{
              this.setState({ satisfied:!this.state.satisfied})
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
      // } else {
      //   this.setState({
      //     satisfied:!this.state.satisfied,
      //     satisfied_deal_id: event.target.value
      //   })
      // }
    }

    render() {
      //console.log(this.state.acceptor1, this.state.initiator1, '22222')

        return (

                <div className="page">
                    <div className="page-content container-fluid">
                        <div className="panel title_border">
                            <div className="panel-heading">
                                <h3 className="panel-title"><i className="panel-title-icon icon fa-handshake-o" aria-hidden="true" />Ваши Сделки {this.state.userId}</h3>
                            </div>
                        </div>
                        <div className="row">
                           <div className="col-md-4">
                            <div className="panel ">
                              <div className="panel-heading">
                                    <h3 className="panel-title"><i className="panel-title-icon icon fa-list-ul" aria-hidden="true" />Узнать подробнее</h3>
                                </div>

                                  {(this.state.deals.length!=0)?(
        <div className="">
            {this.state.deals.map((deal, s) =>
                <div  key={s} className="">

                        <div className="">
                            <div className="panel panel-bordered">
                                <div className="panel-heading margin-left">
                                    <h3>{deal.lawname}</h3>
                                    <h5>{this.dateFormat(deal.duedate)}</h5>
                                </div>
                                <div className="panel-body">

                                    <div className="rating-lg"  />
                                        <div style={{fontSize: '16px'}}>
                                        <div className="my_weight"><i id={s} aria-hidden="true" />Стороны договора: </div>
                                            <div><i id={s} aria-hidden="true" />{deal.side1.firstname} {deal.side1.lastname}</div>
                                            <div><i id={s} aria-hidden="true" />{deal.side2.firstname} {deal.side2.lastname}</div>
                                            {/*<div><i id={s} aria-hidden="true" />{deal.status}</div>*/}
                                            <div className="my_weight"><i id={s} aria-hidden="true" />Текущее состояние сделки: </div>
                                            <div>{(deal.status.length != 0) ?(<div>
                                              {(deal.status=='accepted')?(<p>Сделка вступила в силу </p>):(<span></span>)}
                                              {(deal.status=='denied')?(<p>Сделка отклонена</p>):(<span></span>)}
                                              {(deal.status=='requested')?(<p>Сделка запрошена</p>):(<span></span>)}
                                              {(deal.status=='request_deny')?(<p>Сделка запрошена на растожение</p>):(<span></span>)}
                                              {(deal.status=='finished')?(<p>Срок действия договора истек.</p>):(<span></span>)}
                                              {(deal.status=='completed')?(<p>Сделка завершена.</p>):(<span></span>)}
                                              {(deal.status=='completed')?(<p>Сделка завершена.</p>):(<span></span>)}


                                              </div>
                                              ):(<p></p>)}
                                            </div>
                                            {/*<div><Link to={`/dealredirect/${deal._id}/${deal.lawid}`} className="waves-effect" >Просмотреть условия</Link></div>*/}
                                            {(deal.status=='finished')?(
                                            <div className="col-md-8 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-success  d1"
                                             onClick={(event) => this.dealSatisfied(event)}>Удовлетворена ли сделка? (обяз)</button></div>
                                            ):(<div></div>)}
                                            <div className="col-md-8 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-primary  d1"  onClick={(event) => this.dealRedirects(event)}>Просмотреть условия</button></div>
                                            <div className="col-md-8 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-primary  cst_btn d1"  onClick={(event) => this.createPdf(event)}>Запросить справку</button></div>
                                        {    /*{deal.status=='finished' ? (<div className="col-md-8 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-primary  cst_btn d1"  onClick={(event) => this.createPdf(event)}>Запросить справку      </button></div> ) : (<p></p>)}*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                )}
        </div>):(<div className="panel-heading">
                                <h3 className="panel-title">У вас пока нет сделок</h3>
                            </div>)}
                            </div>
                            </div>
                            <div className="col-md-8" id="info">
                            <div className="panel ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="panel-title-icon icon fa-pencil-square-o" aria-hidden="true" />Полная информация о сделке</h3>
                                </div>
                                {(this.state.satisfied==1)?(
<Satisfied  deal_id = {this.state.satisfied_deal_id} />
                                ):(  <h3 className="panel-title">Пока ничего не выбрано</h3>)}
                                {(Object.keys(this.state.deal).length != 0) ? (<div>
                                                                {(this.state.deal.lawid =='406')?(<InfoDeal406 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}

                                                                {(this.state.deal.lawid =='846')?(<InfoDeal846 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}

                                                                {(this.state.deal.lawid =='501')?(<InfoDeal501 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}

                                                                {(this.state.deal.lawid =='540')?(<InfoDeal540 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='604')?(<InfoDeal604 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='683')?(<InfoDeal683 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}

                                                                {(this.state.deal.lawid =='506')?(<InfoDeal506 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip}/>): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='715')?(<InfoDeal715 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip}/>): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='865')?(<InfoDeal865 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='768')?(<InfoDeal768 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='688')?(<InfoDeal688 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='616')?(<InfoDeal616 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal} create_as_ip={this.state.create_as_ip} />): (<h1></h1>)}
                                                                </div>) :(<div className="panel-heading">

                                </div>)}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

        );
    }
}

export default MyDealsParent;
