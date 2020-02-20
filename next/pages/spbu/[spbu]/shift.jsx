import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import { useRouter } from 'next/router'


const Reports = () => {
    const router = useRouter()
    const { uuid } = router.query


}

class Report extends Component {
    
    static getInitialProps({ query }) {
        return { query }
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Shift',
                url: `/spbu/${this.props.query.spbu}/shift`
            }
        ]


        return (
            <Layout title={'Laporan SPBU ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                ini shift spbu {this.props.query.spbu}
            </Layout>
        )
    }
}

export default Report;