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
            title: 'Payment',
            url: `/spbu/${uuid}/payment`
        }
    ]
    

    return (
        <Layout title={'Payment ' + uuid} breadcrumb={breadcrumb}>
            ini payment {uuid}
        </Layout>
    )
}

export default Index;