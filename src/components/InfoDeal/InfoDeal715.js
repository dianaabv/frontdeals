import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
//calendar
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;
import swal from 'sweetalert'


class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           //deals: [],
            status: '',
            message: '',
            acceptor_status:'',
            side1:this.props.data[0].side1,
            side2: this.props.data[0].side2,
            duedate: this.props.data[0].duedate,
            deadline: this.props.data[0].deadline,
            loanterm: this.props.data[0].loanterm,
            loanamount: this.props.data[0].loanamount,
            awardamount: this.props.data[0].awardamount,
            additional: this.props.data[0].additional,
            isChangable: true

        }
       // this.onChange=this.onChange.bind(this)
        this.changeRender=this.changeRender.bind(this)
        this.handleChangesLoanamount=this.handleChangesLoanamount.bind(this)
        this.handleChangesAwardamount=this.handleChangesAwardamount.bind(this)
        this.handleChangesAdditional=this.handleChangesAdditional.bind(this)
        this.updateDeal517=this.updateDeal517.bind(this)
        this.acceptDeal=this.acceptDeal.bind(this)
        
        //this.changeRoles1=this.changeRoles1(this)
      
    }
   componentDidMount() {
      var deal_id=this.props.data[0].deal_id
      axios.get('http://localhost:4001/api/getmystatus?deal_id='+deal_id,{
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
      });
   }
   acceptDeal(){
      var deal_id=this.props.data[0].deal_id
      axios.get('http://localhost:4001/api/acceptdeal?deal_id='+deal_id,{
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

   handleChangesLoanamount(event){
    this.setState({
      loanamount: event.target.value
    })
   }
   handleChangesAwardamount(event){
    this.setState({
      awardamount: event.target.value
    })
   }
   handleChangesAdditional(event){
    this.setState({
      additional: event.target.value
    })
   }

    changeRender(){
        this.setState({
            isChangable:  !this.state.isChangable
        })
    }
    updateDeal517(){
      //console.log(typeof(this.state.receiver))

            // side1:this.props.data[0].side1,
            // side2: this.props.data[0].side2,
            // duedate: '',
            // deadline:'',
            // loanterm: '',
            // loanamount: this.props.data[0].loanamount,
            // awardamount: this.props.data[0].awardamount,
            // additional: this.props.data[0].additional,

const formData = `deal_id=${this.props.data[0].deal_id}&side1=${this.state.side1._id}&side2=${this.state.side2._id}&duedate=${this.state.duedate}&deadline=${this.state.deadline}&loanterm=${this.state.loanterm}&loanamount=${this.state.loanamount}&awardamount=${this.state.awardamount}&additional=${this.state.additional}`
    
      //console.log(formData,'ddddddddddddds')
        axios.post('http://localhost:4001/api/updateDeal715',formData, {
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
      var z = compareDeals(this.props.olddeal, this.props.data[0])
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
                        <h4>Сторона 1 (Заниматель)</h4>
                        <label className="form-control-label">{this.props.data[0].side1.firstname} {this.props.data[0].side1.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Сторона 2</h4>
                        <label className="form-control-label">{this.props.data[0].side2.firstname} {this.props.data[0].side2.lastname}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("loanamount")  ? 'update_bg' : '')}>
                        <h4>Cумма займа*</h4>
                        <label className="form-control-label">{this.props.data[0].loanamount}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("loanterm")  ? 'update_bg' : '')}>
                        <h4>Срок займа</h4>
                        <label className="form-control-label">{this.props.data[0].loanterm}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("awardamount")  ? 'update_bg' : '')}>
                        <h4>Размер вознаграждения</h4>
                        <label className="form-control-label">{this.props.data[0].awardamount}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("deadline")  ? 'update_bg' : '')}>
                        <h4>Сроки и порядок выплаты вознаграждения:</h4>
                        <label className="form-control-label">{this.props.data[0].deadline}</label>
                    </div>
                    <div className={"form-group " + (objKeys.includes("duedate")  ? 'update_bg' : '')}>
                        <h4>Срок действия договора</h4>
                        <label className="form-control-label">{this.props.data[0].duedate}</label>
                    </div>
                     <div className={"form-group " + (objKeys.includes("additional")  ? 'update_bg' : '')}>
                        <h4>Дополнительные условия</h4>
                        <label className="form-control-label">{this.props.data[0].additional}</label>
                    </div>
                    <div className="form-group">
                        {(this.state.status=='acceptor' && this.state.acceptor_status=='requested')?(<button className="btn btn-primary btn-block " onClick={this.acceptDeal}>Принять текущие условия сделки</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                        {(this.state.dealstatus!='accepted' && this.state.dealstatus!='denied')?(<button className="btn btn-primary btn-block " onClick={this.changeRender}>Внести изменения</button>):(<div></div>)}
                    </div>
                    <div className="form-group">
                         <button className="btn btn-primary btn-block " onClick={this.changeRender}>Отменить сделку</button>
                    </div>
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
                        <h4>Сторона 1 (Заниматель)</h4>
                        <label className="form-control-label"> {this.props.olddeal.side1.firstname} {this.props.olddeal.side1.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Сторона 2</h4>
                        <label className="form-control-label">{this.props.olddeal.side2.firstname} {this.props.olddeal.side2.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h4>Cумма займа*</h4>
                        <label className="form-control-label">{this.props.olddeal.loanamount}</label>
                    </div>
                    <div className="form-group">
                        <h4>Срок займа</h4>
                        <label className="form-control-label">{this.props.olddeal.loanterm}</label>
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
                        <label className="form-control-label">{this.props.olddeal.duedate}</label>
                    </div>
                    <div className="form-group">
                        <h4>Дополнительные условия</h4>
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
                              <h4>Сторона 1 (Заниматель)</h4>
                              <label className="form-control-label">{this.state.side1.firstname} {this.state.side1.lastname}</label>    
                          </div>
                          </div>
                          <div className="col-md-6">
                          <div className="form-group">
                              <h4>Сторона 2</h4>
                              <label className="form-control-label">{this.state.side2.firstname} {this.state.side2.lastname}</label>
                          </div>
                          </div>
                      </div>
                          <div className="form-group">
                              <h4>Cумма займа</h4>
                              <input type="text" defaultValue={this.state.loanamount} name='loanamount' onChange={this.handleChangesLoanamount}className="form-control"  name="quantity"  />
                          </div>
                          <div className="form-group">
                              <h4>Срок займа</h4>
                                <label className="form-control-label">Текущие данные:  {this.props.data[0].deadline}</label>
                                <DatePickerInput
                                      minDate={today}
                                      className='my-react-datepicker'
                                      value={this.state.value}
                                      onChange={(jsDate) => this.setState({deadline: jsDate})}
                                      locale='ru'/>
                          </div>
                          <div className="form-group">
                              <h4>Размер вознаграждения</h4>
                              <input type="text" defaultValue={this.state.awardamount} name='awardamount' onChange={this.handleChangesAwardamount}className="form-control"  name="quantity"  />
                          </div>
                          <div className="form-group">
                              <h4>Дополнительные условия</h4>
                              <input type="text" defaultValue={this.state.additional} name='additional' onChange={this.handleChangesAdditional}className="form-control"  name="quantity"  />
                          </div>
                          <div className="form-group">
                              <h4>Сроки и порядок выплаты вознаграждения</h4>
                              <label className="form-control-label">Текущие данные: {this.props.data[0].loanterm}</label>
                               <DatePickerInput
                                      minDate={today}
                                      className='my-react-datepicker'
                                      value={this.state.value}
                                      onChange={(jsDate) => this.setState({loanterm: jsDate})}
                                      locale='ru'/>
                          </div>
                          <div className="form-group">
                              <h4>Срок действия договора</h4>
                              <label className="form-control-label">Текущие данные: {this.props.data[0].duedate}</label>
                               <DatePickerInput
                                      minDate={today}
                                      className='my-react-datepicker'
                                      value={this.state.value}
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
