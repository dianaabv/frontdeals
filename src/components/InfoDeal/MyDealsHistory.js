import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import jwtDecode from 'jwt-decode';
import {Timeline, TimelineEvent} from 'react-event-timeline';






class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: [],
            time: [],
            deal: {},
            userId:'',
            lawid: '',

        },
        this.dealRedirects=this.dealRedirects.bind(this)
         this.dateFormat=this.dateFormat.bind(this);

    }
    componentDidMount() {
     // window.location.reload()
  
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
    dealRedirects(event){
      const formData = `lawid=${event.target.name}&dealid=${event.target.value}`;
      //console.log(formData, 'formData')
      axios.post('https://sdelkibackend.herokuapp.com/api/gethistorydeal',formData,{
        responseType: 'json',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `bearer ${Auth.getToken()}`
      }
      }).then(res => {
          this.setState({
           time: res.data.time
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
    render() {
      // console.log(this.state.time, 'sss')
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
                                            <div className="my_weight"><i id={s} aria-hidden="true" />Текущее состояние сделки: </div>
                                            <div>{(deal.status.length != 0) ?(<div>
                                              {(deal.status=='accepted')?(<p>Сделка вступила в силу </p>):(<span></span>)}
                                              {(deal.status=='denied')?(<p>Сделка отклонена</p>):(<span></span>)}
                                              {(deal.status=='requested')?(<p>Сделка запрошена</p>):(<span></span>)}
                                              {(deal.status=='requested_deny')?(<p>Сделка запрошена на растожение</p>):(<span></span>)}
                                              {(deal.status=='request_deny')?(<p>Сделка запрошена на растожение</p>):(<span></span>)}
                                              {(deal.status=='finished')?(<p>Срок действия договора истек.</p>):(<span></span>)}
                                              {(deal.status=='completed')?(<p>Сделка завершена.</p>):(<span></span>)}


                                              </div>
                                              ):(<p></p>)}
                                            </div>

                                           {/* <div><i id={s} aria-hidden="true" />{deal.status}</div>
                                           <div><Link to={`/dealredirect/${deal._id}/${deal.lawid}`} className="waves-effect" >Подробнее</Link></div>*/}
                                            <div className="col-md-6 pull-right"><button value={deal._id} name={deal.lawid} className="btn btn-primary btn-block d1"  onClick={(event) => this.dealRedirects(event)}>Подробнее</button></div>
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
                            <div className="col-md-8">
                             <div className="panel ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="panel-title-icon icon fa-pencil-square-o" aria-hidden="true" />Полная информация о сделке</h3>
                                </div>
                                {this.state.time.length!= 0 ? (
                                    <Timeline id="timelime">
{this.state.time.map((tl, s) =>
   <TimelineEvent key ={s} title={tl.title}
                           createdAt={this.dateFormat(tl.date)}
                           icon={<i className="fa fa-pencil"></i>}>
                           {(tl.finals)?(<p>Претензия : {tl.finals}</p>):(<p></p>)}
                           {tl.title=='Внесены изменения в сделку' ?(<p>В следущие поля были внесены изменения : {tl.fields}</p>): (<p></p>)}
                           {(tl.action_initiator)?(  <p>Инициатор действия : {tl.action_initiator.firstname} {tl.action_initiator.lastname}  </p>):(<p></p>)}
                           {tl.role_status ? (<p>Статус: {tl.role_status}</p>) :(<span></span>)}



            </TimelineEvent>

)}

    </Timeline>
    ) :(<p></p>)}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

        );
    }
}

export default MyDealsParent;
