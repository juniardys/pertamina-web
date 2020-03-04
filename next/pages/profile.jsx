import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'

class Index extends Component {
    componentDidMount() {
        checkAuth()
    }

    render() {
        const breadcrumb = [
            {
                title: 'Pengaturan Akun',
                url: '/profile'
            }
        ]

        return (
            <Layout title="Pengaturan Akun" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Pengaturan Akun<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index;