import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Divider} from 'antd';
import axios from 'axios';
import FoodSearchEngine from "./foodSearch";

const EditableContext = React.createContext();
// new
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
//
class EditableCell extends React.Component {

  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Proszę wpisać ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class MealsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: [], 
      editingKey: '',
      count: 0, 
      foodSearch: false,
    };

    this.columns = [
      {
        title: 'nazwa produktu',
        dataIndex: 'nazwaProduktu',
        width: '25%',
        editable: true,
      },
      {
        title: 'liczba kalorii',
        dataIndex: 'liczbaKalorii',
        width: '14%',
        editable: true,
      },
      {
        title: 'liczba porcji',
        dataIndex: 'liczbaPorcji',
        width: '10%',
        editable: true,
      },
      {
        title: 'wielkość porcji [g/ml]',
        dataIndex: 'wielkoscPorcji',
        width: '14%',
        editable: true,
      },
      {
        title: 'białko [g]',
        dataIndex: 'bialko',
        width: '13%',
        editable: true,
      },
      {
        title: 'węglowodany [g]',
        dataIndex: 'weglowodany',
        width: '13%',
        editable: true,
      },
      {
        title: 'tłuszcze [g]',
        dataIndex: 'tluszcze',
        width: '13%',
        editable: true,
      },
      {
        title: 'operacja',
        dataIndex: 'operation',
        width: '130px',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Zapisz
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Jesteś pewien?" onConfirm={() => this.cancel(record.key)}>
                <a>Anuluj</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                Edytuj
              </a>
              <Divider type="vertical" />
              <Popconfirm title="Jesteś pewien, że chcesz usunąć produkt?" onConfirm={() => this.handleDelete(record.key, record.liczbaKalorii, record.bialko, record.tluszcze, record.weglowodany)}>
                <a>Usuń</a>
              </Popconfirm>
              </span>
          );
        },
      },

    ];
  }

  componentDidMount() {
    let dataFromProps = this.props.data;
    if(dataFromProps[0]){
      let max = dataFromProps[0].key;
      for(let i =0 ; i<dataFromProps.length ; i++){
        if(dataFromProps[i].key>max){
          max = dataFromProps[i].key
        }
      }
      this.setState({count: max})
    }
    else{
      this.setState({count: 0})
    }
    
    this.setState({data: dataFromProps})
  }

  handleAdd = () => {
    const { count, data } = this.state;
    const newData = {
      key: count + 1,
      nazwaProduktu: "nazwa produktu",
      liczbaKalorii: 0,
      liczbaPorcji: 0,
      wielkoscPorcji: 0,
      bialko: 0,
      tluszcze : 0,
      weglowodany: 0,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
  };

  handleDelete = (key, kalorie, bialko, tluszcze, weglowodany) => {
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });

    axios.post('http://127.0.0.1:8000/user/deleteMeal/',{
      token: localStorage.getItem('token'),
      klucz: key,
      dzien: this.props.dataWDzienniku,
      nazwaPosilku: this.props.nazwaPosilku,
      kalorie: kalorie,
      bialko: bialko,
      tluszcze: tluszcze,
      weglowodany:weglowodany,
      },)
      .then(res => {
      })
      .catch(error =>{
          console.log("error")
      })
      this.props.parentCallback( kalorie, bialko, tluszcze, weglowodany, "minus")
  };
  
  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    console.log(key)
    form.validateFields((error, row) => {
      console.log(row)
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }

      axios.post('http://127.0.0.1:8000/user/updateMeal/',{
      token: localStorage.getItem('token'),
      nazwaProduktu: row.nazwaProduktu,
      liczbaPorcji: row.liczbaPorcji,
      wielkoscPorcji: row.wielkoscPorcji,
      liczbaKalorii: row.liczbaKalorii,
      miara: row.miara,
      klucz: key,
      dzien: this.props.dataWDzienniku,
      nazwaPosilku: this.props.nazwaPosilku,
      bialko: row.bialko,
      weglowodany: row.weglowodany,
      tluszcze: row.tluszcze,
      },)
      .then(res => {
      })
      .catch(error =>{
          console.log("error")
      })
      this.props.parentCallback( row.liczbaKalorii, row.bialko, row.tluszcze, row.weglowodany, "plus")
    });
    
  }

  edit(key) {
    this.setState({ editingKey: key });
  }
  handleFoodSearchEngine = () => {
    this.setState({foodSearch: true})
  }

  callbackFunction = (nazwaProduktu, liczbaKalorii, liczbaPorcji, wielkoscPorcji, bialko, wegle, tluszcze, blonnik) => {
    this.props.parentCallback( liczbaKalorii, bialko, tluszcze, wegle, "plus")
    console.log(wegle)
    const { count, data } = this.state;
    let keyVal = count + 1
    const newData = {
      key: count + 1,
      nazwaProduktu: nazwaProduktu,
      liczbaKalorii: liczbaKalorii,
      liczbaPorcji: liczbaPorcji,
      wielkoscPorcji: wielkoscPorcji,
      bialko: bialko,
      tluszcze: tluszcze,
      weglowodany: wegle,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
    axios.post('http://127.0.0.1:8000/user/updateMeal/',{
      token: localStorage.getItem('token'),
      nazwaProduktu: nazwaProduktu,
      liczbaPorcji: liczbaPorcji,
      wielkoscPorcji: wielkoscPorcji,
      liczbaKalorii: liczbaKalorii,
      miara: "",
      klucz: keyVal,
      dzien: this.props.dataWDzienniku,
      nazwaPosilku: this.props.nazwaPosilku,
      bialko: bialko,
      tluszcze: tluszcze,
      weglowodany: wegle,
      },)
      .then(res => {
      })
      .catch(error =>{
          console.log("error")
      })

    this.setState({foodSearch: false})
  }
  onAnulujClick = () => {
    this.setState({foodSearch: false})
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'nazwaProduktu' ||'miara' ? 'text' : 'number',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div >
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination = {false}
          />
        </EditableContext.Provider>
        <Button onClick={this.handleAdd} type="primary" style={{ marginTop: 16, marginRight: 16, marginBottom: 16 }}>
          Szybkie dodawanie produktu
        </Button>
        {
          this.state.foodSearch ?
            null
          :
          <Button onClick={this.handleFoodSearchEngine} type="primary" style={{ marginTop: 16, marginRight: 16, marginBottom: 16 }}>
            Wyszukiwarka produktów
          </Button>
        }
        {
          this.state.foodSearch ?
          <div>
            <FoodSearchEngine parentCallback = {this.callbackFunction}/>
            <Button  onClick = {this.onAnulujClick} type="danger" style={{ marginTop: 16, marginRight: 16, marginBottom: 16 }}>
              Anuluj wyszukiwanie
            </Button>
          </div>  
          :
            <span> </span>
        }
        </div>
    );
  }
}

const Meals = Form.create()(MealsTable);

export default Meals;