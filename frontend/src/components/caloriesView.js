import React from 'react';
import {Card, Col, Row} from 'antd';

class CaloriesView extends React.Component {
	state = {
        liczbaKaloriiCel: "" + this.props.kcalCel,
        liczbaKaloriiZproduktow: "" + this.props.kcalZProduktow,
        liczbaPozstalychKalorii: "" + this.props.kcalPozostalo,
    }

    componentWillReceiveProps(nextProps) {
        this.setState({liczbaKaloriiZproduktow: "" + nextProps.kcalZProduktow})
        this.setState({liczbaPozstalychKalorii: "" + nextProps.kcalPozostalo})
      }

  render() {
      const style = {
          color: "green"
      }
      if(this.state.liczbaPozstalychKalorii<0){
          style.color =  "red"
      }

    return (
        <div>
              <div style={{  padding: '0px',width: '380px',  border: "solid", borderWidth: '1px', borderRadius: '4px', margin: '0 auto' }}>
                <h1 style = {{padding: '10px'}}> Pozostałe kalorie:</h1>
                <Row gutter={16} style={{  width: '380px',}}>
                <Col span={3} style={{  width: '81px' }}>
                    <Card title={this.state.liczbaKaloriiCel} bordered={false} size = {"small"}>
                    CEL
                    </Card>
                </Col>
                <Col span={3}style={{  width: '51px' }}>
                    <Card title="-" bordered={false} size = {"small"}></Card>
                </Col>
                <Col span={6} style={{  width: '90px' }}>
                    <Card title={this.state.liczbaKaloriiZproduktow} bordered={false} size = {"small"} >
                    PRODUKTY
                    </Card>
                </Col>
                <Col span={3}style={{  width: '51px' }}>
                    <Card title="=" bordered={false} size = {"small"}></Card>
                </Col>
                <Col span={3} style={{  width: '100px' }}>
                    <Card style = {style} title={this.state.liczbaPozstalychKalorii} bordered={false} size = {"small"}>
                    POZOSTAŁO
                    </Card>
                </Col>
                </Row>
            </div>
        </div>
    );
  }
}

export default CaloriesView;
