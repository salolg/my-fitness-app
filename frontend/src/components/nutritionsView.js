import React from 'react';
import { Doughnut } from 'react-chartjs-2';

class NutritionsView extends React.Component {

    state = {
        bialko: this.props.bialko,
        tluszcze: this.props.tluszcze,
        weglowodany: this.props.weglowodany,
    }
  componentWillReceiveProps(nextProps) {
    this.setState({bialko: nextProps.bialko})
    this.setState({tluszcze: nextProps.tluszcze})
    this.setState({weglowodany: nextProps.weglowodany})
  }

  render() {
    let nutrData =  {
        borderWidth: 0,
        labels: ['Białko [g]', 
        'Tłuszcze [g]', 
        'Węglowodany [g]'],
        datasets: [{
            data: [this.state.bialko,
                this.state.tluszcze,
                this.state.weglowodany
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56' ],
            hoverBackgroundColor: [ '#FF6384', '#36A2EB', '#FFCE56' ]
        }]
    }
    return (
        <div>
            {
                this.props.bialko && this.props.tluszcze && this.props.weglowodany ?
                <Doughnut data={nutrData} options={{ responsive: false, maintainAspectRatio: true}} />
                :
                null
            }
        </div>
    );
  }
}

export default NutritionsView;
