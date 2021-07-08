import React, { Component } from 'react'
import { Grid, Form, Button, Segment } from 'semantic-ui-react'
import AuthenticationService from './Services/AuthenticationService'
import StorageProvider from './Services/StorageProvider'
import jsonWebTokenService from 'jsonwebtoken'
import api from "./api";

class LoginPage extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            email: null,
            password: null
        }

        this.auth = new AuthenticationService()
        this.localForage = StorageProvider
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveJwt = this.saveJwt.bind(this)
    }

    async componentDidMount(){
        const response = await api.post('/authenticate', {"email": "mi@unijobs.com", "password": "1111"});
        // this.setState({tipos_produtos: response.data})
        console.log(response);
    }

    handleChange (target, data) {
        this.setState({
            [data.name]: data.value
        })
    }

    async saveJwt(jwt) {
        try {
            if (jwt) {
                const decodedJwt = jsonWebTokenService.decode(jwt)
                // await this.localforage.setItem('jwt_usuario', jwt)
                // await this.localforage.setItem('dados_usuario', decodedJwt)
                return true
            }
        } catch (err) {
            if (err instanceof jsonWebTokenService.JsonWebTokenError) return false
            throw err
        }
    }

    handleSubmit () {
        this.setState({loading: true}) // Para desabilitarmos os campos
        try {
            const {email, password} = this.state
            const jwt = this.auth.doLogin(email, password)
            const isUserValid = this.saveJwt(jwt)
            if (isUserValid)
            return true // email é válido, pode prosseguir
        } catch (err) {
            // Tratamento de erros e exibição de mensagem para o usuário
        }
    }

    render () {
        return (
            <Grid columns={1} padded style={{ height: '100vh' }} verticalAlign='middle' className='login-wrapper'>
                <Grid.Row as='main' centered>
                    <Grid.Column largeScreen={5} computer={5} tablet={5} mobile={12}>
                        <Segment id='loginForm'>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Input
                                    disabled={this.state.loading}
                                    focus
                                    icon='user'
                                    iconPosition='left'
                                    loading={this.state.loading}
                                    name='email'
                                    fluid
                                    label='Email'
                                    onChange={this.handleChange}
                                    placeholder='Seu email'
                                />

                                <Form.Input
                                    disabled={this.state.loading}
                                    icon='lock'
                                    iconPosition='left'
                                    loading={this.state.loading}
                                    name='password'
                                    fluid
                                    label='Senha'
                                    onChange={this.handleChange}
                                    type='password'
                                    placeholder='Sua senha'
                                />

                                <Button
                                    disabled={this.state.loading}
                                    loading={this.state.loading}
                                    size='huge'
                                    fluid
                                    content='Entrar'
                                    icon='sign in'
                                    labelPosition='left'
                                    color='vk'
                                    type='submit'
                                />
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default LoginPage