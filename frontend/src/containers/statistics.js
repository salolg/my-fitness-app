import React from 'react';
import { Bar } from 'britecharts-react';
import 'britecharts-react/dist/britecharts-react.min.css';
import axios from 'axios';

class Statistics extends React.Component {
  state = {
    data: "",
  }
  componentDidMount(){
    axios.post('http://127.0.0.1:8000/user/allUserData/',{
      userToken: localStorage.getItem('token'),
      date : " ",
    },)
      .then(res => {
        let dataArray = []
        for( var key in res.data.waga){
          let value = {
            "value" : res.data.waga[key]["wartoscWagi"],
            "name" : res.data.waga[key]["data"]
          }
          dataArray.push(value)
        }
        console.log(dataArray)
        this.setState({data: dataArray})
    })
    .catch(error =>{
        console.log("error")
    })
  }

  render() {
    return (
        <div>
          <h1>Wykres zmiany wagi:</h1>
          {
            this.state.data ?
            <Bar
              data={this.state.data}
              height={700}
              enableLabels={true}
              isAnimated ={true}
              labelsNumberFormat={'.4'}
              betweenBarsPadding={0.5}
              margin={{
                  left: 100,
                  right: 40,
                  top: 40,
                  bottom: 40
        }}
          ></Bar>
          :
          <span>Brak danych.</span>
          }
        </div>
    );
  }
}

export default Statistics;
