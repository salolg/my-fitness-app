import React from 'react';
import {Input, Table} from 'antd';
import axios from 'axios';
import DefaultLoader from "./loader";
import ProductDescription from "./productDescription";

const { Search } = Input;

const columns = [
    {
      title: 'Opis',
      dataIndex: 'description',
      key: 'description',
    },
    {
        title: 'Marka',
        dataIndex: 'brandOwner',
        key: 'description',
    },
    
  ];

class FoodSearchEngine extends React.Component {
	state = {
        tableFlag: false,
        data: [],
        loading: false,
        searchInputFlag: true,
        mealData: "",
        message: "",
    }
    onSearch = value => {
        this.setState({loading: true})
        this.setState({searchInputFlag: false})
        axios.post('http://127.0.0.1:8000/foodSearch/generalSearchInput/',
        
        {
            generalSearchInput: value,
        },)
        .then(res => {
            this.setState({tableFlag: true, data: res.data.result})
            this.setState({loading: false})
        })
        .catch(error =>{
            console.log("error")
            this.setState({loading: false})
        })
    }
    
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRowKeys);
          console.log(selectedRows);
          this.setState({tableFlag: false})
          this.setState({loading: true})
          axios.post('http://127.0.0.1:8000/foodSearch/foodDetails/',{
            fdcId : "" + selectedRows[0].fdcId,
          })
          .then(res => {
              this.setState({loading: false})
              this.setState({mealData: res.data})
          })
          .catch(error =>{
              console.log("error")
              this.setState({loading: false})
          })
        },
        getCheckboxProps: record => ({
          name: record.name,
        }),
      };
      callbackFunction = (nazwaProduktu, liczbaKalorii, liczbaPorcji, wielkoscPorcji, bialko, wegle, tluszcze, blonnik) => {
        this.props.parentCallback(nazwaProduktu, liczbaKalorii, liczbaPorcji, wielkoscPorcji, bialko, wegle, tluszcze, blonnik);
        console.log(wegle)
      }

  render() {
    return (
        <div>
            {
                this.state.searchInputFlag ?
                    <Search
                    placeholder="wpisz nazwe produktu"
                    enterButton="Wyszukaj"
                    size="large"
                    onSearch={this.onSearch}
                    />
                :
                    <span></span>
            }
            {
                this.state.loading ?
                <DefaultLoader/>
                :
                <span> </span>
            }
            {
                this.state.tableFlag ? 
                    <Table columns={columns} size={"small"} dataSource={this.state.data} pagination = {false} rowSelection={this.rowSelection}/>
                :
                    <span> </span>
            }
            {
              this.state.mealData ?

                <ProductDescription mealData={this.state.mealData} parentCallback = {this.callbackFunction} />
              :
                <span> </span>  
            }
        </div>
    );
  }
}

export default FoodSearchEngine;
