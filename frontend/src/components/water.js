import React from 'react';
import { Table, Input, InputNumber, Button} from 'antd';
import axios from 'axios';

class Water extends React.Component {
    state = {
        inputValue: 0,
        flag: true,
    }
    onChange = (value) => {
        this.setState({inputValue: value})
      }
    addWater = () => {
        console.log(this.state.inputValue)
        console.log(this.props.dataWDzienniku)
        this.setState({flag: true})
        axios.post('http://127.0.0.1:8000/user/addWater/',{
            token: localStorage.getItem('token'),
            dzien: this.props.dataWDzienniku,
            wartosc: this.state.inputValue,
            },)
            .then(res => {
            })
            .catch(error =>{
                console.log("error")
            })
    }  
    dodajWode = () =>{
        this.setState({flag: false})
    }
  render() {
    return (
        <div>
            <img src={ require('../static/water.gif') }
            height = "150"
            width = "150"
        ></img> 
        
        
        {
            this.state.flag ?
            <Button  onClick = {this.dodajWode}>Dodaj wode</Button>
            :
            <span><InputNumber defaultValue onPressEnter = {this.addWater} onChange={this.onChange}/> ml </span>
        }
        </div>
    );
  }
}

export default Water;
