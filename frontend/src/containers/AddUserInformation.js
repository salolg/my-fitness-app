import React from 'react';
import { Form, Input, Cascader, Button, Select, DatePicker, InputNumber } from 'antd';
import axios from 'axios';
import moment from 'moment'; 

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
class AddUserInformation extends React.Component {
	state = {
    countriesList : null,
    userName: "",
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
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('http://127.0.0.1:8000/user/createUser/',{
          nazwaUzytkownika: this.state.userName,
          userToken: localStorage.getItem('token'),
          dataUrodzenia : values.dataUrodzenia.format("YYYY-MM-DD"),
          plec : values.plec[0],
          krajZamieszkania : values.lokalizacja[0],
          wzrost : values.wzrost,
          waga : values.waga,
          kalorie : values.kalorie,
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
        <h1> Dodaj podstawowe informacje o sobie: </h1>
        <Form onSubmit={this.handleSubmit} className="user-information">
        <Form.Item label = "Płeć:">
          {getFieldDecorator('plec', {
            rules: [
              {  required: true, message: 'Proszę wybrać płeć.' },
            ],
          })(<Cascader options={plec} placeholder="Płeć" size = "default"/>)}
        </Form.Item>

        <Form.Item label = "Data urodzenia: ">
          {getFieldDecorator('dataUrodzenia', {
            rules: [{ type: 'object', required: true, message: 'Prosze wpisać datę urodzenia' }],
          })(<DatePicker placeholder = "Data urodzenia"/>)}  
        </Form.Item>

        <Form.Item label = "Kraj zamieszkania:">
          {getFieldDecorator('lokalizacja', {
            rules: [
              { type: 'array', required: true, message: 'Proszę wybrać kraj zamieszkania.' },
            ],
          })(<Cascader placeholder="Kraj zamieszkania" options={this.state.countriesList} />)}
        </Form.Item>

        <Form.Item label = "Wzrost [cm]:">
          {getFieldDecorator('wzrost', {
            rules: [{ required: true, message: 'Proszę wpisać swój wzrost.' }],
          })(
            <InputNumber placeholder ="Wzrost" min={1} />,
          )}
        </Form.Item>

        <Form.Item label = 'Waga [kg]:'>
          {getFieldDecorator('waga', {
            rules: [{ required: true, message: 'Proszę wpisać swoją wagę.' }],
          })(
            <InputNumber placeholder ="Waga" min={1} />,
          )}
        </Form.Item>

        <Form.Item label = 'Liczba kalorii będąca dziennym celem:'>
          {getFieldDecorator('kalorie', {
            rules: [{ required: true, message: 'Proszę wpisać liczbę kalorii.' }],
          })(
            <InputNumber placeholder ="Liczba kalorii" min={1} />,
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

const WrappedAddUserInformationForm = Form.create({ name: 'log' })(AddUserInformation);
export default WrappedAddUserInformationForm;
