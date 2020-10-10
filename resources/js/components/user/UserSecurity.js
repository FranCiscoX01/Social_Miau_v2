import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import copy from 'copy-to-clipboard';

import RandomPassword from './utils/RandomPassword'

import {
  Form,
  Input,
  Button,
  Divider,
  Switch,
  message,
  notification,
 } from 'antd';

import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export default class UserSecurity extends Component {
    constructor(props) {
      super (props)
      this.state = {
        pwd: '',
        pass: '',
        confirm_pass: '',
        config: {
          symbol: true,
          number: true,
          mayus: true,
          lower: true,
        },
        character: 8,
      }
      this.handleInputChange = this.handleInputChange.bind(this)
      this.handleSymbolChange = this.handleSymbolChange.bind(this)
      this.handleNumberChange = this.handleNumberChange.bind(this)
      this.handleMayusChange = this.handleMayusChange.bind(this)
      this.addCharacter = this.addCharacter.bind(this)
      this.restCharacter = this.restCharacter.bind(this)
      this.saveChanges = this.saveChanges.bind(this)
      this.generatePassword = this.generatePassword.bind(this)
      this.copyTextClipboard = this.copyTextClipboard.bind(this)
    }

    handleSymbolChange(checked) {
      const symbol = checked
      this.setState(prevState => ({
        config: {
          ...prevState.config,
          symbol
        }
      }))
    }

    handleNumberChange(checked) {
      const number = checked
      this.setState(prevState => ({
        config: {
          ...prevState.config,
          number
        }
      }))
    }

    handleMayusChange(checked) {
      const mayus = checked
      this.setState(prevState => ({
        config: {
          ...prevState.config,
          mayus
        }
      }))
    }

    copyTextClipboard() {
      message.config({ top: 300, });
      if (this.state.pwd !== '') {
        copy(this.state.pwd);
        message.success('Copied');
      } else {
        message.error('Password not Generated');
      }
    }

    addCharacter() {
      if (this.state.character <= 23) {
        this.setState(prevState => {
          return {
            character: prevState.character + 1
          }
        })
      } else {
        message.warning('Max of characters');
      }
    }

    restCharacter() {
      if (this.state.character > 8) {
        this.setState(prevState => {
          return {
            character: prevState.character - 1
          }
        })
      } else {
        message.warning('Min of characters');
      }
    }

    handleInputChange(e) {
      const n = e.target.name
      const v = e.target.value
      // console.log(n)
      this.setState({
        [n]: v
      })
    }

    generatePassword() {
      const { config, character } = this.state;
      let pwd = new RandomPassword()
        .setLength(character)
        .setLowerCase(config.lower)
        .setUpperCase(config.mayus)
        .setNumberCase(config.number)
        .setSymbol(config.symbol)
        .generate();
      this.setState({ pwd })
    }

    saveChanges() {
      const id_user = this.props.user.id
      const headers = {
        'Authorization': 'Bearer ' + this.props.user.api_token
      }
      if (this.state.pass.length === 0) {
        return message.error('New password its required.')

      } else if (this.state.confirm_pass.length === 0) {
        return message.error('Confirm password its required.')
      }
      if (this.state.pass.length > 0 && this.state.pass.length < 8) {
        return message.error('Password not valid (8 characters min)')
      }
      if (this.state.pass != this.state.confirm_pass) {
        return message.error('Passwords do not match')
      } else {
        axios.post(`/api/profile/new-password/${id_user}`, {
          new_password: this.state.pass,
          confirm_password: this.state.confirm_pass
        }, {
          headers: headers
        })
        .then(response => {
          // console.log(response)
          this.setState({
            pass: '',
            confirm_pass: '',
          })
          if (response.data.success) {
            return(
              notification.open({
                message: 'Success',
                description:
                  response.data.message,
                icon: <CheckCircleOutlined style={{ color: '#74DF00' }} />,
              })
            )
          } else {
            return(
              notification.open({
                message: 'Error',
                description:
                  response.data.message,
                icon: <CheckCircleOutlined style={{ color: '#74DF00' }} />,
              })
            )
          }
        })
        .catch(error => {
          console.log(error)
        })
      }
    }

    render() {
        const { pass, confirm_pass, character, tooltip, pwd } = this.state

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <form>
                          <div className="form-group">
                            <label htmlFor="pass">New Password</label>
                            <Input.Password className="form-control" name="pass" value={pass} onChange={this.handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label htmlFor="confirm_pass">Confirm Password</label>
                            <Input.Password className="form-control" name="confirm_pass" value={confirm_pass} onChange={this.handleInputChange} />
                          </div>
                          <div className="form-group text-right">
                            <Button type="primary" shape="round" onClick={() => {this.saveChanges()}}>
                              Save
                            </Button>
                          </div>
                        </form>
                        <Divider orientation="left">Password Generator</Divider>
                        <div className="container">
                          <div className="row">
                            <div className="col-4">
                              <div className="row text-center">
                                <div className="col-4"><Button type="primary" className="text-center" block onClick={() => {this.restCharacter()}}>-</Button></div>
                                <div className="col-4"><Input className="text-center" value={character} readOnly bordered={false} /></div>
                                <div className="col-4"><Button type="primary" className="text-center" block onClick={() => {this.addCharacter()}}>+</Button></div>
                              </div>
                              <div className="row text-center mt-3">
                                <div className="col-12">
                                  <label>Simbolos</label>
                                  <span className="px-3"></span>
                                  <Switch defaultChecked onChange={this.handleSymbolChange} />
                                </div>
                              </div>
                              <div className="row text-center mt-3">
                                <div className="col-12">
                                  <label>Números</label>
                                  <span className="px-3"></span>
                                  <Switch defaultChecked onChange={this.handleNumberChange} />
                                </div>
                              </div>
                              <div className="row text-center mt-3">
                                <div className="col-12">
                                  <label>Mayusculas</label>
                                  <span className="px-3"></span>
                                  <Switch defaultChecked onChange={this.handleMayusChange} />
                                </div>
                              </div>
                            </div>
                            <div className="col-2 text-center"><Divider type="vertical" /></div>
                            <div className="col-4 text-center">
                              <div className="mb-5">
                                <Button type="primary" onClick={() => {this.generatePassword()}} >Generate</Button>
                              </div>
                              <div className="row">
                                <div className="col-10">
                                  <Input placeholder="Password Generated" id="pwd" readOnly value={pwd} />
                                </div>
                                <div className="col-2">
                                  <Button type="dashed" shape="circle" onClick={() => {this.copyTextClipboard()}} icon={<CopyOutlined />} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('user-security')) {
    ReactDOM.render(<UserSecurity />, document.getElementById('user-security'));
}
