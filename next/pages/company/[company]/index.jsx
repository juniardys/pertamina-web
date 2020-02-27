import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'

class Payment extends Component {
    componentDidMount() {
        checkAuth()
    }

    static getInitialProps({ query }) {
        return { query }
    }

    render() {
        const breadcrumb = [
            {
                title: 'Perusahaan',
                url: '/company'
            },
            {
                title: 'Dashboard',
                url: `/company/${this.props.query.company}`
            }
        ]


        return (
            <Layout title={'Dashboard ' + this.props.query.company} breadcrumb={breadcrumb}>
                Dashboard
            </Layout>
        )
    }
}

export default Payment;