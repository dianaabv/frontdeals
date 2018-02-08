import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
//calendar
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import 'moment/locale/ru.js' ;



class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           //deals: [],
            status: '',
            message: '',
            acceptor_status:'',
            presenter:this.props.data[0].presenter,
            receiver: this.props.data[0].receiver,
            duedate: '',
            deadline:'',
            itemname: this.props.data[0].itemname,
            quantity: this.props.data[0].quantity,
            additional: this.props.data[0].additional,
            isChangable: true

        }
       // this.onChange=this.onChange.bind(this)
        this.changeRender=this.changeRender.bind(this)
        this.handleChangesItemName=this.handleChangesItemName.bind(this)
        this.handleChangesQuantity=this.handleChangesQuantity.bind(this)
        this.handleChangesAdditional=this.handleChangesAdditional.bind(this)
        this.updateDeal506=this.updateDeal506.bind(this)
        this.acceptDeal=this.acceptDeal.bind(this)
        
        //this.changeRoles1=this.changeRoles1(this)
      
    }
   componentDidMount() {
      var deal_id=this.props.data[0].deal_id
      axios.get('http://185.100.67.106:4040/api/getmystatus?deal_id='+deal_id,{
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

   changeRoles1(event){
      var presenter=this.state.presenter
      var receiver=this.state.receiver
      var buf= presenter
      this.setState({
        presenter: receiver,
        receiver:buf

      })
   }
   handleChangesItemName(event){
    this.setState({
      itemname: event.target.value
    })
   }
   handleChangesQuantity(event){
    this.setState({
      quantity: event.target.value
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
    updateDeal506(){
      console.log(typeof(this.state.receiver))

      const formData = `deal_id=${this.props.data[0].deal_id}&receiver=${JSON.stringify(this.state.receiver)}&presenter=${JSON.stringify(this.state.presenter)}&itemname=${this.state.itemname}&quantity=${this.state.quantity}&additional=${this.state.additional}&deadline=${this.state.deadline}&duedate=${this.state.duedate}`
      
      //console.log(formData,'ddddddddddddds')
        axios.post('http://185.100.67.106:4040/api/updateDeal506',formData, {
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

    // onChange = (e) => {
    //     console.log(e.target.name, e.target.value )
    //     this.setState({ [e.target.name]: e.target.value });
    // }
    // componentWillMount(){
    //     document.getElementById('body').className='animsition';
    // }

    render() {
      const today=new Date();
      today.setDate(today.getDate() + 1)   
      console.log(this.state.status,'deeee')
        return (
       <div>
       {(this.state.isChangable=='1')?(
                <div className="panel-body">
            <div className="row">
              <div className="col-md-6">
                <div className="col-md-12">
                <div className="form-group">
                      <h2>Договор Дарения</h2>
                    </div>
                    <div className="form-group">
                        <h3>Даритель</h3>
                        <label className="form-control-label"> {this.props.data[0].presenter.firstname} {this.props.data[0].presenter.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h3>Одаряемый</h3>
                        <label className="form-control-label">{this.props.data[0].receiver.firstname} {this.props.data[0].receiver.lastname}</label>
                    </div>
                    <div className="form-group">
                        <h3>Наименование дара (вещи или имущественного права (требование) либо освобождения от имущественной обязанности)</h3>
                        <label className="form-control-label">{this.props.data[0].itemname}</label>
                    </div>
                    <div className="form-group">
                        <h3>Количество дара</h3>
                        <label className="form-control-label">{this.props.data[0].quantity}</label>
                    </div>
                    <div className="form-group">
                        <h3>Сроки и порядок передачи дара(момент перехода права собственности)</h3>
                        <label className="form-control-label">{this.props.data[0].deadline}</label>
                    </div>
                    <div className="form-group">
                        <h3>Дополнительные условия (не обязательное ус-ие)                            </h3>
                        <label className="form-control-label">{this.props.data[0].additional}</label>
                    </div>
                    <div className="form-group">
                        <h3>Срок действия договора</h3>
                        <label className="form-control-label">{this.props.data[0].duedate}</label>
                    </div>
           {/*         <div className="form-group">
                               {(this.state.status=='acceptor' && this.state.dealstatus=='requested')?(<button className="btn btn-primary btn-block " onClick={this.acceptDeal}>Я согласен с условиями сделки</button>):(<div></div>)}
                               {(this.state.status !='accepted')?( <button className="btn btn-primary btn-block " onClick={this.changeRender}>Внести изменения</button>):(
                                    <button className="btn btn-primary btn-block " disabled >Вы не можете вносить изменения, Сделка уже заключена</button>)}
                               </div>*/}
                  <div className="form-group">
                          {(this.state.dealstatus!='accepted')?(<button className="btn btn-primary btn-block " onClick={this.changeRender}>Внести изменения</button>):(<div></div>)}
                          </div>
                        <div className="form-group">
                                               {(this.state.status=='acceptor' && this.state.acceptor_status=='requested')?(<button className="btn btn-primary btn-block " onClick={this.changeRender}>Принять сделку</button>):(<div></div>)}
                                               </div>
                          <div className="form-group">
                            <button className="btn btn-primary btn-block " onClick={this.changeRender}>Отменить сделку</button>
                          </div>
                </div>
              </div>
              <div className="col-md-6">
                <h2>Draturi</h2>
              </div>
            </div>
        </div>
       
):(<div className="panel-body">
            <div className="row">
                <div className="col-md-12">
                <div className="row">
                 <div className="col-md-6">

                    <div className="form-group">
                        <h3>Даритель</h3>
                        <label className="form-control-label">{this.state.presenter.firstname} {this.state.presenter.lastname}</label>    
                    </div>
                    </div>
                    <div className="col-md-6">
                    <div className="form-group">
                        <h3>Одаряемый</h3>
                        <label className="form-control-label">{this.state.receiver.firstname} {this.state.receiver.lastname}</label>
                    </div>
                    </div>
                    <div className="col-md-4">
                    <div className="form-group">
                        <button className="btn btn-primary btn-block " onClick={this.changeRoles1.bind(this)} > <i className="fa fa-refresh" aria-hidden="true"></i> Поменять роли</button>
                    </div>
                    </div>
                </div>
                    <div className="form-group">
                        <h3>Наименование дара (вещи или имущественного права (требование) либо освобождения от имущественной обязанности)</h3>
                        <input type="text" defaultValue={this.state.itemname} name='itemname' onChange={this.handleChangesItemName}className="form-control"  name="quantity"  />
                    </div>
                    <div className="form-group">
                        <h3>Количество дара</h3>
                        <input type="text" defaultValue={this.state.quantity} name='quantity' onChange={this.handleChangesQuantity}className="form-control"  name="quantity"  />
                    </div>
                    <div className="form-group">
                        <h3>Сроки и порядок передачи дара(момент перехода права собственности)</h3>
                        <label className="form-control-label">Текущие данные:  {this.props.data[0].deadline}</label>
                         <DatePickerInput
                                minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({deadline: jsDate})}
                                locale='ru'/>
                    </div>
                    <div className="form-group">
                        <h3>Дополнительные условия (не обязательное ус-ие)                            </h3>
                        <input type="text" defaultValue={this.state.additional} name='additional' onChange={this.handleChangesAdditional}className="form-control"  name="quantity"  />
                    </div>
                    <div className="form-group">
                        <h3>Срок действия договора</h3>
                        <label className="form-control-label">Текущие данные: {this.props.data[0].duedate}</label>
                         <DatePickerInput
                                minDate={today}
                                className='my-react-datepicker'
                                value={this.state.value}
                                onChange={(jsDate) => this.setState({duedate: jsDate})}
                                locale='ru'/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block " onClick={this.updateDeal506}>Сохранить изменения</button>
                    </div>
                    <div className="form-group">

                    <button className="btn btn-primary btn-block " onClick={this.changeRender}>Отменить изменения</button>
                  {/*<button className="btn btn-primary btn-block " onClick={this.changeRender}>Отменить Cделку</button>*/}
                        
                  
                    </div>
                </div>
            </div>
        </div>)}
</div>
        );
    }
}

export default MyDealsParent;
