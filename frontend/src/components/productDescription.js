import React from 'react';
import {Card, InputNumber, Button} from 'antd';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import DefaultLoader from "./loader";

class ProductDescription extends React.Component {
	state = {
        // nutrData: "",
        liczbaKalorii: 0,
        kalorieWPorcji: 0,
        liczbaPorcji: 1,
        wielkoscPorcji: 100,
        bialko: 0,
        wegle: 0,
        tluszcze: 0,
        blonnik: 0,
        bialkoWPorcji: 0,
        wegleWPorcji: 0,
        tluszczeWPorcji: 0,
        blonnikWPorcji: 0,
    }
    componentDidMount(){
        let nutr = []
        console.log(this.props.mealData.nutritiens)
        for( let i in this.props.mealData.nutritiens){
            if(this.props.mealData.nutritiens[i].name === 'Energy'){
                this.setState({liczbaKalorii: this.props.mealData.nutritiens[i].amount, kalorieWPorcji:  this.props.mealData.nutritiens[i].amount })
            }
            else{
                if(this.props.mealData.nutritiens[i].name === 'Białko'){
                    this.setState({bialko: this.props.mealData.nutritiens[i].amount})
                    this.setState({bialkoWPorcji: this.props.mealData.nutritiens[i].amount})
                }
                if(this.props.mealData.nutritiens[i].name === 'Tłuszcze'){
                    this.setState({tluszcze: this.props.mealData.nutritiens[i].amount})
                    this.setState({tluszczeWPorcji: this.props.mealData.nutritiens[i].amount})
                }
                if(this.props.mealData.nutritiens[i].name === 'Węglowodany'){
                    this.setState({wegle: this.props.mealData.nutritiens[i].amount})
                    this.setState({wegleWPorcji: this.props.mealData.nutritiens[i].amount})
                }
                nutr.push(this.props.mealData.nutritiens[i])
        }
                
    }
    }
    onChangeLiczbaPorcji = (value) => {
        this.setState({liczbaPorcji: value})
        this.setState({kalorieWPorcji: value * this.state.wielkoscPorcji * this.state.liczbaKalorii/100})
        this.setState({bialkoWPorcji: value * this.state.wielkoscPorcji * this.state.bialko/100})
        this.setState({wegleWPorcji: value * this.state.wielkoscPorcji * this.state.wegle/100})
        this.setState({tluszczeWPorcji: value * this.state.wielkoscPorcji * this.state.tluszcze/100})
        this.setState({blonnikWPorcji: value * this.state.wielkoscPorcji * this.state.blonnik/100})
        
    }

    onChangeWielkoscPorcji = (value) => {
        this.setState({wielkoscPorcji: value})
        this.setState({kalorieWPorcji: value * this.state.liczbaPorcji * this.state.liczbaKalorii/100})
        this.setState({bialkoWPorcji: value * this.state.liczbaPorcji * this.state.bialko/100})
        this.setState({wegleWPorcji: value * this.state.liczbaPorcji * this.state.wegle/100})
        this.setState({tluszczeWPorcji: value * this.state.liczbaPorcji * this.state.tluszcze/100})
        this.setState({blonnikWPorcji: value * this.state.liczbaPorcji * this.state.blonnik/100})
    }

    onClickDodajProdukt = () => {
        console.log(this.state.wegleWPorcji)
        console.log(this.state.bialkoWPorcji)
        this.props.parentCallback(this.props.mealData.name, this.state.kalorieWPorcji, this.state.liczbaPorcji, this.state.wielkoscPorcji,
            this.state.bialkoWPorcji, this.state.wegleWPorcji, this.state.tluszczeWPorcji, this.state.blonnikWPorcji);
    }
    
    

  render() {
    let nutrData =  {
        borderWidth: 0,
        labels: ['Białko [g]', 
        'Tłuszcze [g]', 
        'Węglowodany [g]'],
        datasets: [{
            data: [this.state.bialkoWPorcji,
                this.state.tluszczeWPorcji,
                this.state.wegleWPorcji
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56' ],
            hoverBackgroundColor: [ '#FF6384', '#36A2EB', '#FFCE56' ]
        }]
    }
    return (
        <div>
            {   
                this.props.mealData.name ?
                    <Card title={this.props.mealData.name}>
                        <p>Energia w 100g/ml: {this.state.liczbaKalorii} kcal.</p>
                        <p>Liczba porcji: <InputNumber min={0} onChange={this.onChangeLiczbaPorcji} defaultValue={this.state.liczbaPorcji}/> </p>
                        <p>Wielkość porcji: <InputNumber min={0} onChange={this.onChangeWielkoscPorcji} defaultValue={this.state.wielkoscPorcji}/> gram/ml. </p>
                        <p>Energia w Twojej porcji: {this.state.kalorieWPorcji} kcal.</p>
                        <p>
                            <h2>Wartości odżywcze w porcji: </h2>
                            <Doughnut data={nutrData} options={{ responsive: false, maintainAspectRatio: true}} />
                        </p> 
                        <Button onClick={this.onClickDodajProdukt} type="primary" style={{ marginTop: 16, marginRight: 16, marginBottom: 16 }}>
                            Dodaj produkt
                        </Button>
                    </Card>
                        
                :
                    <span>Brak danych o produkcie.</span>
            }
        </div>
    );
  }
}

export default ProductDescription;
