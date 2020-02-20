import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import { useRouter } from 'next/router'


const Report = () => {
    const router = useRouter()
    const { uuid } = router.query

    const breadcrumb = [
        {
            title: 'SPBU',
            url: '/spbu'
        },
        {
            title: 'Laporan',
            url: `/spbu/${uuid}/report`
        }
    ]
    

    return (
        <Layout title={'Laporan SPBU ' + uuid} breadcrumb={breadcrumb}>
            ini laporan spbu {uuid}
        </Layout>
    )
}

export default Report;