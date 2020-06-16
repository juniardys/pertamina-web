import React, { Component } from 'react'
import Layout from "~/components/layouts/Auth";
import { toast, login, redirectPath } from '~/helpers'
import axios from 'axios'
import Router from 'next/router'
import Link from "next/link"

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        if (localStorage.getItem('auth') != null) redirectPath()
        this.btnLogin = Ladda.create(document.querySelector('.btn-spinner'))
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    async _tryLogin() {
        this.btnLogin.start()
        if (this.state.email == '') {
            toast.fire({ icon: 'warning', title: 'Email dan password tidak boleh kosong' })
            this.btnLogin.stop()
        } else {
            await axios.post(`/api/v1/forgot`, {
                api_key: process.env.APP_API_KEY,
                email: this.state.email
            })
                .then(async response => {
                    await login(response.data.data.token)
                })
                .catch(error => {
                    if (error.response.data) toast.fire({ icon: 'warning', title: 'Terjadi Kesalahan' })
                    this.btnLogin.stop()
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
                            <h5 className="content-group">Lupa Password <small className="display-block">Ketikkan kredensial dengan benar.</small></h5>
                        </div>

                        <div className="form-group has-feedback has-feedback-left">
                            <input type="text" className="form-control" placeholder="Email" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            <div className="form-control-feedback">
                                <i className="icon-mail5 text-muted"></i>
                            </div>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block btn-ladda btn-ladda-spinner ladda-button btn-spinner" data-spinner-color="#333" data-style="slide-down" onClick={() => this._tryLogin()}>
                                <span className="ladda-label">Submit <i className="icon-circle-right2 position-right"></i></span>
                                <span className="ladda-spinner"></span>
                            </button>
                        </div>

                        <div className="text-center">
                            <Link href="/" as="/">
                                <a href="#">Sudah Punya Akun?</a>
                            </Link>
                        </div>
                    </div>
                </form>
            </Layout>
        )
    }
}

export default Index;