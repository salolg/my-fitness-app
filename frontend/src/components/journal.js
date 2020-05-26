import React from 'react';
import {Collapse, Button, Icon,Card, Col, Row } from 'antd';
import axios from 'axios';
import Meals from './meals.js'
import CaloriesView from './caloriesView.js'
import NutritionsView from './nutritionsView.js'
import Water from './water';
const { Panel } = Collapse;


class Journal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      liczbaKaloriiCel: 1,
      liczbaKaloriiProdukty: 1,
      liczbaPozostalychKalorii: 1,
      sumaBialka: 0,
      sumaWeglowodanow: 0,
      sumaTluszczy: 0 ,
      sniadanie: [],
      obiad: [],
      przekaski: [],
      kolacja: [],
      woda: [],
      data: "",
      wyswietlaczKalorii: false,
    }
  }
	
  
  componentDidMount(){
    this.setState({ data : this.props.match.params.data });

    axios.post('http://127.0.0.1:8000/user/userData/',{
      userToken: localStorage.getItem('token'),
      date : this.props.match.params.data,
    },)
    .then(res => {
      this.setState({ liczbaKaloriiCel: res.data.liczbaKaloriiDziennie })
      let journal_data = res.data.kalendarzPosilkow[this.props.match.params.data];
      console.log(this.props.match.params.data)
      console.log(res.data.kalendarzPosilkow[this.props.match.params.data])
  
      this.setState({ sniadanie: journal_data.sniadanie, obiad:  journal_data.obiad, przekaski: journal_data.przekaski , kolacja: journal_data.kolacja })
      
      this.setState({ woda: journal_data.woda })
      this.setState({ liczbaKaloriiProdukty: journal_data.liczbaKaloriiZProduktow })

      this.setState({ sumaBialka: journal_data.sumaBialka })
      this.setState({ sumaTluszczy: journal_data.sumaTluszczy })
      this.setState({ sumaWeglowodanow: journal_data.sumaWeglowodanow })

      let liczbaPozostalychKal = res.data.liczbaKaloriiDziennie - journal_data.liczbaKaloriiZProduktow
      this.setState({ liczbaPozostalychKalorii: liczbaPozostalychKal })
      this.setState({ wyswietlaczKalorii: true })
    })
     .catch(error =>{
        console.log("error")
        })
  }
  onClendarButtonClick = val => {
    this.props.history.push("/kalendarz")
  }
  
  callbackFunction = (liczbaKalorii, bialko, tluszcze, weglowodany,znak ) => {
    let nowaliczbaKaloriiProdukty = 0.0
    let nowaliczbaPozostalychKal = 0.0
    let nowaSumaBialka = 0.0
    let nowaSumaTluszczy = 0.0
    let nowaSumaWeglowodanow = 0.0
    if (znak === "minus"){
       nowaliczbaKaloriiProdukty =  parseFloat(this.state.liczbaKaloriiProdukty) - parseFloat(liczbaKalorii)
       nowaliczbaPozostalychKal = parseFloat(this.state.liczbaPozostalychKalorii) + parseFloat(liczbaKalorii)
       nowaSumaBialka = parseFloat(this.state.sumaBialka) - parseFloat(bialko)
       nowaSumaTluszczy = parseFloat(this.state.sumaTluszczy) - parseFloat(tluszcze)
       nowaSumaWeglowodanow = parseFloat(this.state.sumaWeglowodanow) - parseFloat(weglowodany)
    }
    else{
      nowaliczbaKaloriiProdukty = parseFloat(this.state.liczbaKaloriiProdukty) + parseFloat(liczbaKalorii)
      nowaliczbaPozostalychKal = parseFloat(this.state.liczbaPozostalychKalorii) - parseFloat(liczbaKalorii)
      nowaSumaBialka = parseFloat(this.state.sumaBialka) + parseFloat(bialko)
      nowaSumaTluszczy = parseFloat(this.state.sumaTluszczy) + parseFloat(tluszcze)
      nowaSumaWeglowodanow = parseFloat(this.state.sumaWeglowodanow) + parseFloat(weglowodany)
    }
     
    console.log(nowaliczbaPozostalychKal)
    this.setState({liczbaKaloriiProdukty: nowaliczbaKaloriiProdukty})
    this.setState({ liczbaPozostalychKalorii: nowaliczbaPozostalychKal })

    this.setState({sumaBialka: nowaSumaBialka})
    this.setState({sumaTluszczy: nowaSumaTluszczy})
    this.setState({sumaWeglowodanow: nowaSumaWeglowodanow})

  }

  render() {
    return (
      <div>
        {
          this.state.wyswietlaczKalorii ?
          <div style = {{padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '680px'}}> 
           <CaloriesView kcalCel={this.state.liczbaKaloriiCel} kcalZProduktow={this.state.liczbaKaloriiProdukty} kcalPozostalo={this.state.liczbaPozostalychKalorii}/>
            {
              this.state.woda !== 0 ?
              <div style={{ marginLeft: '10px', padding: '0px',width: '190px', height: "146px",  border: "solid", borderWidth: '1px', borderRadius: '4px' }}>
              <h1 style = {{padding: '10px'}}> Wypita woda [ml]:</h1>
              <Row  style={{  width: '380px', alignItems: 'center',  justifyContent: 'center'}}>
              <Col  style={{  width: '140px',  alignItems: 'center',  justifyContent: 'center' }}>
                  <Card title={this.state.woda} bordered={false} size = {"small"}>
                  </Card>
              </Col>                
              </Row>
          </div>
          : null
            }
           
           <NutritionsView bialko = {this.state.sumaBialka} weglowodany = {this.state.sumaWeglowodanow} tluszcze = {this.state.sumaTluszczy} />
            
           
         </div>
          :
          null
        }
        <Collapse style ={{minWidth: '600px'}}>
          <Panel header="Śniadanie" key="1" >
            <Meals data = {this.state.sniadanie} nazwaPosilku = "sniadanie" 
            dataWDzienniku ={this.state.data} parentCallback = {this.callbackFunction}/>
          </Panel>
          <Panel header="Obiad" key="2">
          <Meals data = {this.state.obiad} nazwaPosilku = "obiad" 
          dataWDzienniku ={this.state.data} parentCallback = {this.callbackFunction}/>
          </Panel>
          <Panel header="Przekąski" key="3">
          <Meals data = {this.state.przekaski} nazwaPosilku = "przekaski" 
          dataWDzienniku ={this.state.data} parentCallback = {this.callbackFunction}/>
          </Panel>
          <Panel header="Kolacja" key="4">
          <Meals data = {this.state.kolacja} nazwaPosilku = "kolacja" 
          dataWDzienniku ={this.state.data} parentCallback = {this.callbackFunction}/>
          </Panel>
          <Panel header="Woda" key="5">
            <p><Water dataWDzienniku ={this.state.data}/></p>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default Journal;