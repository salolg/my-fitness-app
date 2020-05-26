import React from 'react';
import axios from 'axios';
import moment from 'moment'; 
import { Form, Input, Cascader, Button, Select, DatePicker, InputNumber } from 'antd';

const plec = [
  {
    value: 'kobieta',
    label: 'kobieta'
  },
  {
    value: 'mężczyzna',
    label: 'mezczyzna'
  }
]

class UserProfile extends React.Component {

  state = {
    countriesList : null,
    plec: "",
    kraj: "",
    dataUrodzenia: "",
    wzrost: "",
    liczbaKaloriiDziennie: "",
    waga: "",
  }
  componentDidMount(){
    axios.get('http://127.0.0.1:8000/data/listOfCountries')
    .then(res => {
      console.log(res.data.res)
      this.setState({ countriesList: res.data.res})
      this.setState({ userName: this.props.location.state.userName})
      console.log( this.props.location.state.userName)
    })
    .catch(error =>{
        console.log("error")
    })

    axios.post('http://127.0.0.1:8000/user/allUserData/',{
      userToken: localStorage.getItem('token'),
      date : "",
    },)
    .then(res => {
      this.setState({plec: res.data.plec})
      this.setState({kraj: res.data.kraj})
      this.setState({dataUrodzenia: res.data.dataUrodzenia})
      this.setState({wzrost: res.data.wzrost})
      this.setState({liczbaKaloriiDziennie: res.data.liczbaKaloriiDziennie})

      let ostatniaWaga = 0
      for(let i in res.data.waga){
        ostatniaWaga = res.data.waga[i]["wartoscWagi"]
      }
      this.setState({waga: ostatniaWaga})
    })
    .catch(error =>{
      console.log("error")
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let plecV;
        let dataUrodzeniaV;
        let lokalizacjaV;
        let wzrostV;
        let wagaV;
        let kalorieV;
        if(values.plec===undefined){
          plecV = this.state.plec
        }
        else{
          plecV = values.plec[0]
        }
        if(values.dataUrodzenia===undefined){
          dataUrodzeniaV = this.state.dataUrodzenia
        }
        else{
          dataUrodzeniaV = values.dataUrodzenia.format("YYYY-MM-DD")
        }
        if(values.lokalizacja===undefined){
          lokalizacjaV = this.state.kraj
        }
        else{
          lokalizacjaV = values.lokalizacja[0]
        }
        if(values.wzrost===undefined){
          wzrostV = this.state.wzrost
        }
        else{
          wzrostV = values.wzrost
        }
        if(values.waga===undefined){
          wagaV = this.state.waga
        }
        else{
          wagaV = values.waga
        }
        if(values.kalorie===undefined){
          kalorieV = this.state.liczbaKaloriiDziennie
        }
        else{
          kalorieV = values.kalorie
        }
        axios.post('http://127.0.0.1:8000/user/updateUserData/',{
          userToken: localStorage.getItem('token'),
          dataUrodzenia : dataUrodzeniaV,
          plec : plecV,
          krajZamieszkania : lokalizacjaV,
          wzrost : wzrostV,
          waga : wagaV,
          kalorie : kalorieV,
          currentDate : moment().format("YYYY-MM-DD"),

        },)
        .then(res => {
          console.log(res)
          this.props.history.push({
            pathname: '/kalendarz'
          });
        })
        .catch(error =>{
            console.log("error")
        })

      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { size } = this.props;
    return (
      <div>
        <h1> Edytuj informacje: </h1>
        <Form onSubmit={this.handleSubmit} className="user-information">
        <Form.Item label = "Płeć:">
          {getFieldDecorator('plec')(<Cascader options={plec} placeholder={this.state.plec} size = "default"/>)}
        </Form.Item>

        <Form.Item label = "Data urodzenia: ">
          {getFieldDecorator('dataUrodzenia')(<DatePicker placeholder = {this.state.dataUrodzenia}/>)}  
        </Form.Item>

        <Form.Item label = "Kraj zamieszkania:">
          {getFieldDecorator('lokalizacja')(<Cascader placeholder={this.state.kraj} options={this.state.countriesList} />)}
        </Form.Item>

        <Form.Item label = "Wzrost [cm]:">
          {getFieldDecorator('wzrost')(
            <InputNumber placeholder ={this.state.wzrost} min={1} />,
          )}
        </Form.Item>

        <Form.Item label = 'Waga [kg]:'>
          {getFieldDecorator('waga')(
            <InputNumber placeholder ={this.state.waga} min={1} />,
          )}
        </Form.Item>

        <Form.Item label = 'Liczba kalorii będąca dziennym celem:'>
          {getFieldDecorator('kalorie')(
            <InputNumber placeholder = {this.state.liczbaKaloriiDziennie} min={1} />,
          )}
        </Form.Item>
              
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Zatwierdź dane
          </Button>
        </Form.Item>
      </Form>
          
      </div>
    );
  }
}
const WrappedUserProfile = Form.create({ name: 'userProfile' })(UserProfile);
export default WrappedUserProfile;
