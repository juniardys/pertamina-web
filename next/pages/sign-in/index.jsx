import React, { Component } from 'react'
import Layout from "~/components/layouts/Auth";

class Index extends Component {
    render() {
        return (
            <Layout>
                <form action="index.html">
                    <div className="panel panel-body login-form">
                        <div className="text-center">
                            <div className="icon-object border-slate-300 text-slate-300"><i className="icon-reading"></i></div>
                            <h5 className="content-group">Masuk ke akun anda <small className="display-block">Ketikkan kredensial dengan benar.</small></h5>
                        </div>

                        <div className="form-group has-feedback has-feedback-left">
                            <input type="text" className="form-control" placeholder="Username" />
                            <div className="form-control-feedback">
                                <i className="icon-user text-muted"></i>
                            </div>
                        </div>

                        <div className="form-group has-feedback has-feedback-left">
                            <input type="password" className="form-control" placeholder="Password" />
                            <div className="form-control-feedback">
                                <i className="icon-lock2 text-muted"></i>
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block">Masuk <i className="icon-circle-right2 position-right"></i></button>
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