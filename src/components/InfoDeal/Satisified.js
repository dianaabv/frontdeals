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
import { browserHistory } from 'react-router';
class MyDealsParent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          k:false,
          sat:{
            ans: '',
            reason:''
          },
          valid_err: []
        }
        this.dealSat = this.dealSat.bind(this)
        this.updatedeal = this.updatedeal.bind(this)
    }

    componentWillMount(){
      var token = Auth.getToken();
      var decoded = jwtDecode(token);
      this.setState({
        status: decoded.userstatus
      });
    }
   dealSat(event){
     if(event.target.name=='ans' && event.target.value=='Нет'){
       this.setState({k:!this.state.k})
     }
     if(event.target.name=='ans' && event.target.value=='Да'){
       this.state.sat["reason"] = "";
       this.setState({k:false})
     }
     if(event.target.name=='ans' && event.target.value==''){
       this.state.sat["reason"] = "";
       this.setState({k:false})
     }
    const field = event.target.name;
    const sat = this.state.sat;
    sat[field] = event.target.value;
   }
   updatedeal(){
     var valid =[]
     if(this.state.sat.ans.length==0){
       valid.push('ans')
     }
     if(this.state.sat.ans == 'Нет' && this.state.sat.reason.length == 0){
       valid.push('reason')
     }
     this.setState({
       valid_err: valid
     })
     if(valid.length ==0){
       console.log(this.state.sat)
       const formData = `sat=${JSON.stringify(this.state.sat)}&deal_id=${this.props.deal_id}`;
       //   //console.log(formData, 'formData')
         axios.post('https://sdelkibackend.herokuapp.com/api/updatefinisheddeal',formData, {
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
             setTimeout(function(){
              swal(res.data.message).then(function(){
              browserHistory.push('/mydeals');
              window.location.reload();
              })
          }, 1000);
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


   }
    render() {
      const today=new Date();
      today.setDate(today.getDate() + 1)
      console.log(this.props.deal_id,'sss')
      return (
        <div className="panel-body">
          <div className="row">

              <div className="col-md-12">
              <div className="form-group">
                <h3>Удовлетворены ли условия сделки вашим контрагентом?</h3>
              </div>

              <div className="form-group">
                    <select className={"form-control " + (this.state.valid_err.includes("ans")  ? 'input_err' : '')}  onChange={this.dealSat} name="ans" >
                    <option value="" >Удовлетворены ли все условия сделки?</option>
                      <option value="Да" >Да</option>
                      <option value="Нет">Нет</option>
                    </select>
                  </div>
                    {(this.state.k==1)?(
                      <div className="form-group">
                        <h4 className="form-control-label"  >Опишите суть претензии</h4>
                        <input onChange={this.dealSat}  type="text" className={"form-control " + (this.state.valid_err.includes("reason")  ? 'input_err' : '')} name="reason"   autoComplete="off" />
                      </div>
                    ):(
                      <div></div>
                    )}
                    <div className="form-group">
                        <button className="btn btn-primary btn-block " onClick={this.updatedeal}>Отправить</button>
                    </div>
              </div>


          </div>
        </div>

        );
    }
}

export default MyDealsParent;
