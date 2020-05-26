import React from 'react';
import { Form, Icon, Input, Button, Spin, Alert } from 'antd';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios';
import * as actions from '../store/actions/auth';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class NormalLoginForm extends React.Component {
	state = {
		// flags
		errorAlert: false,

		// data storage
		errorAlertMessage: null,
	}
    
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('http://127.0.0.1:8000/rest-auth/login/', {
            username: values.userName,
            password: values.password,
        })
        .then(res => {
            console.log(res)
            const token = res.data.key;
            this.props.onAuth(token);
            this.props.history.push('/kalendarz');
        })
        .catch(err => {
            console.log(err)
						
            if(err.request.response){
                let errMessage = err.request.response.substring(22, err.request.response.length - 3)
                let expression = new RegExp('",', 'g');
                let newErrMessage = errMessage.replace(expression, ' ');
                expression = new RegExp('"', 'g');
                errMessage = newErrMessage.replace(expression, '');
                errMessage = errMessage.replace('Unable to log in with provided credentials.', 'Niepoprawna nazwa użytkownika lub hasło.')
                this.setState({ errorAlert: true, errorAlertMessage: errMessage })
            }
            else{
                this.setState({ errorAlert: true, errorAlertMessage: "Coś poszło nie tak." })
            }
        })
      }
    });
	}
	
	onCloseErrorAlert = () => {
		this.setState({ errorAlert: false, errorAlertMessage: null})
	}

  render() {
    let errorMessage = null;
    if (this.props.error) {
        errorMessage = (
            <p>{this.props.error.message}</p>
        );
    }

    const { getFieldDecorator } = this.props.form;
    return (
        <div>
            {errorMessage}
            {
                this.props.loading ?

                <Spin indicator={antIcon} />

                :

                <Form onSubmit={this.handleSubmit} className="login-form">

                    <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Proszę wpisać nazwę użytkownika!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nazwa użytkownika" />
                    )}
                    </FormItem>

                    <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Proszę wpisać hasło!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Hasło" />
                    )}
                    </FormItem>

                    <FormItem>
                    <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
                        Zaloguj się
                    </Button>
                    lub 
                    <NavLink 
                        style={{marginRight: '10px'}} 
                        to="/rejestracja"> Zarejestruj się
                    </NavLink>
                    </FormItem>
                </Form>
            }
            {
                this.state.errorAlert ?
                    <Alert
                    message="Błąd"
                    description={this.state.errorAlertMessage}
                    type="error"
                    closable
                    onClose = {this.state.onCloseErrorAlert}
                />
                :
                    <span> </span>
            }
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)) 
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm));