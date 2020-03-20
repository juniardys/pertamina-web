import React, { Component } from 'react'
import { getAcl } from '~/helpers'

const AccessList = (props) => {
    const userAcl = getAcl()
    if (props.acl && userAcl.some(r => props.acl.includes(r))) {
        return props.children    
    }

    return null
}

export default AccessList;