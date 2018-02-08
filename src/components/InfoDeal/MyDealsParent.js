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
import swal from 'sweetalert'




class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: [],
            deal: {},
            userId:'',
            lawid: '',
            dealstatus: '',
            acceptor_status:'',
            dealstatus: '',
            status: '',
            olddeal: {}

        },
        this.dealRedirects=this.dealRedirects.bind(this)
        this.createPdf = this.createPdf.bind(this)
        this.dateFormat=this.dateFormat.bind(this);

    }
    componentDidMount() {
        axios.get('http://185.100.67.106:4040/api/getmydeals',{
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
    dateFormat(date){
      var fDate = new Date(date);
      var m = ((fDate.getMonth() * 1 + 1) < 10) ? ("0" + (fDate.getMonth() * 1 + 1)) : (fDate.getMonth() * 1 + 1);
      var d = ((fDate.getDate() * 1) < 10) ? ("0" + (fDate.getDate() * 1)) : (fDate.getDate() * 1);
      return d + "/" + m + "/" + fDate.getFullYear()
    }
    createPdf(event){
      const formData = `lawid=${event.target.name}&dealid=${event.target.value}`;
      axios.post('http://185.100.67.106:4040/pdf/createpdf',formData, {
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
    dealRedirects(event){
      // data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal}
      this.setState({
       deal :{},
       acceptor_status: '',
       dealstatus: '',
       status: '',
       olddeal: {}
      })
       // console.log(event.target.value, event.target.name)
        const formData = `lawid=${event.target.name}&dealid=${event.target.value}`;
        //console.log(formData, 'formData')
        axios.post('http://185.100.67.106:4040/api/getinfodeal',formData, {
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
      axios.get('http://185.100.67.106:4040/api/getmystatus?deal_id='+event.target.value,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           status: res.data.status,
           dealstatus: res.data.dealstatus,
           acceptor_status: res.data.acceptor_status
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
       // так нельзя делать убери перенеси в info 715
      axios.post('http://185.100.67.106:4040/api/getolddeal', formData, {
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
    // componentWillMount(){
    //     document.getElementById('body').className='animsition';
    // }
    render() {
      //console.log(this.state.deals)
   // console.log(this.state.status, 'status', this.state.dealstatus, 'dealstatus', this.state.acceptor_status, 'acceptor_status')
    // console.log(this.state.deals, 'sss')
    //    console.log(this.state.deal)
    //console.log(this.state.olddeal, 'this.state.deal[0].lawid')
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
                                              {(deal.status=='accepted')?(<p>Сделка вступила в силу </p>):(<p></p>)}
                                              {(deal.status=='denied')?(<p>Сделка отклонена</p>):(<p></p>)}
                                              {(deal.status=='requested')?(<p>Сделка запрощена</p>):(<p></p>)}
                                              {(deal.status=='requested_deny')?(<p>Сделка запрощена на отклонение</p>):(<p></p>)}

                                              </div>
                                              ):(<p></p>)}
                                            </div>
                                            {/*<div><Link to={`/dealredirect/${deal._id}/${deal.lawid}`} className="waves-effect" >Просмотреть условия</Link></div>*/}
                                            <div className="col-md-8 pull-right"><a href="#info"><button value={deal._id} name={deal.lawid} className="btn btn-primary  d1"  onClick={(event) => this.dealRedirects(event)}>Просмотреть условия</button></a></div> 
                                            <div className="col-md-8 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-primary  d1"  onClick={(event) => this.createPdf(event)}>Запросить справку</button></div>
                                            {deal.status=='finished' ? (<div className="col-md-8 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-primary btn-block d1"  onClick={(event) => this.createPdf(event)}>Запросить справку      </button></div> ) : (<p></p>)}
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
                                {(Object.keys(this.state.deal).length != 0) ? (<div>
                                                                {(this.state.deal.lawid =='506')?(<InfoDeal506 data={this.state.deal} name={this.state.deal.status} />): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='715')?(<InfoDeal715 data={this.state.deal} name={this.state.deal.status} olddeal={this.state.olddeal}/>): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='865')?(<InfoDeal865 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal}/>): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='768')?(<InfoDeal768 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal}/>): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='688')?(<InfoDeal688 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal}/>): (<h1></h1>)}
                                                                {(this.state.deal.lawid =='616')?(<InfoDeal616 data={this.state.deal} acceptor_status = {this.state.acceptor_status} dealstatus = {this.state.dealstatus} status = {this.state.status} olddeal={this.state.olddeal}/>): (<h1></h1>)}
                                                                </div>) :(<div className="panel-heading">
                                    <h3 className="panel-title">Пока ничего не выбрано</h3>
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
