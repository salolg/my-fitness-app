import React from 'react';
import { Form, Input, Icon, Button, Alert } from 'antd';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios';
import * as actions from '../store/actions/auth';

const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    // flags
		errorAlert: false,

		// data storage
		errorAlertMessage: null,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
          username:  values.userName,
          email: values.email,
          password1: values.password,
          password2: values.confirm
        })
        .then(res => {
            console.log(res)
            const token = res.data.key;
            this.props.onAuth(token);
            this.props.history.push({
              pathname: '/informacje-o-uzytkowniku',
              state: { userName:  values.userName }
            });
        })
        .catch(err => {  
          
            if(err.request.response){
              let errMessage = err.request.response.substring(15, err.request.response.length - 3);
              let expression = new RegExp('",', 'g');
              let newErrMessage = errMessage.replace(expression, ' ');
              expression = new RegExp('"', 'g');
              errMessage = newErrMessage.replace(expression, '');
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

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Wprowadzone hasła nie są takie same.');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          
          <FormItem>
              {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Proszę wpisac nazwe użytkownika!' }],
              })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nazwa użytkownika" />
              )}
          </FormItem>
          
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'Prosze wpisać poprawny adres e-mail!',
              }, {
                required: true, message: 'Prosze wpisac adres email',
              }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Hasło" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Hasło" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>

          <FormItem>
          <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
              Zarejestruj się
          </Button>
          lub 
          <NavLink 
              style={{marginRight: '10px'}} 
              to='/logowanie/'> Zaloguj się
          </NavLink>
          </FormItem>

        </Form>
        {
          this.state.errorAlert ?
              <Alert
              message="Error"
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

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)) 
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm));