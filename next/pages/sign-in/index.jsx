import React, { Component } from 'react'
import Layout from "~/components/layouts/Auth";
import { checkAuth, toast, login } from '~/helpers'
import axios from 'axios'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        checkAuth()
        this.btnLogin = Ladda.create(document.querySelector('.btn-spinner'))
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    async _tryLogin() {
        this.btnLogin.start()
        if (this.state.email == '' || this.state.password == '') {
            toast.fire({ icon: 'warning', title: 'Email dan password tidak boleh kosong' })
            this.btnLogin.stop()
        } else {
            console.log(process.env.NODE_ENV);
            await axios.post(`/api/v1/sign-in`, {
                api_key: process.env.APP_API_KEY,
                email: this.state.email,
                password: this.state.password
            })
                .then(response => {
                    login(response.data.data.token)
                })
                .catch(error => {
                    if (error.response.data) toast.fire({ icon: 'warning', title: 'Email atau password salah' })
                    this.btnLogin.stop()
                    // console.log(error.response)
                });
        }
    }

    render() {
        return (
            <Layout>
                <form>
                    <div className="panel panel-body login-form">
                        <div className="text-center">
                            <div className="icon-object border-slate-300 text-slate-300"><i className="icon-reading"></i></div>
                            <h5 className="content-group">Masuk ke akun anda <small className="display-block">Ketikkan kredensial dengan benar.</small></h5>
                        </div>

                        <div className="form-group has-feedback has-feedback-left">
                            <input type="text" className="form-control" placeholder="Email" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            <div className="form-control-feedback">
                                <i className="icon-mail5 text-muted"></i>
                            </div>
                        </div>

                        <div className="form-group has-feedback has-feedback-left">
                            <input type="password" className="form-control" placeholder="Password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                            <div className="form-control-feedback">
                                <i className="icon-lock2 text-muted"></i>
                            </div>
                        </div>

                        <div className="form-group">

                            <button className="btn btn-primary btn-block btn-ladda btn-ladda-spinner ladda-button btn-spinner" data-spinner-color="#333" data-style="slide-down" onClick={() => this._tryLogin()}>
                                <span className="ladda-label">Masuk <i className="icon-circle-right2 position-right"></i></span>
                                <span className="ladda-spinner"></span>
                            </button>
                        </div>

                        <div className="text-center">
                            <a href="login_password_recover.html">Lupa Password?</a>
                        </div>
                    </div>
                </form>
            </Layout>
        )
    }
}

export default Index;