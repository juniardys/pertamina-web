import React, { Component } from 'react'
import { checkAcl } from '~/helpers'

const AccessList = (props) => {
    if (checkAcl(props.acl)) {
        return props.children  
    }

    return null
}

export default AccessList;