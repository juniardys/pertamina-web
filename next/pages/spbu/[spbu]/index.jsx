import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import { useRouter } from 'next/router'


const Index = () => {
    const router = useRouter()
    const { uuid } = router.query

    const breadcrumb = [
        {
            title: 'SPBU',
            url: '/spbu'
        },
        {
            title: 'Detail',
            url: '/spbu/' + uuid
        }
    ]
    

    return (
        <Layout title={'Dashboard SPBU ' + uuid} breadcrumb={breadcrumb}>
            ini spbu {uuid}
        </Layout>
    )
}

export default Index;