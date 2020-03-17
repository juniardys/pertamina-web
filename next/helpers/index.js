import Router from 'next/router'
import Swal from 'sweetalert2'
import axios from 'axios'
import { get } from '~/helpers/request'

export const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const checkAclPage = (pageAcl) => {
    const acl = localStorage.getItem('accessList')
    if (acl && !acl.includes(pageAcl)) {
        Swal.fire('Akses Ditolak.', 'Kamu tidak punya akses untuk mengakses halaman ini.', 'warning')
        setTimeout(() => window.history.back(), 1000);
    }
}

export const generateAcl = (acl) => {
    let result = []
    acl.forEach(elem => {
        result.push(elem.access)
    });
    return result
}

export const getAcl = () => {
    return JSON.parse(localStorage.getItem('accessList'))
}

export const setAcl = async (uuid) => {
    const role = await get('/role', {
        search: uuid
    })
    if (role && role.success) {
        const acl = generateAcl(role.data.data[0].accessList)
        await localStorage.setItem('accessList', JSON.stringify(acl))
        // console.log(JSON.parse(localStorage.getItem('accessList')));
    }
}

export const checkAuth = async () => {
    const auth = localStorage.getItem('auth')
    const { pathname } = Router

    if (auth) {
        let profile
        await axios.get(`/api/v1/profile?api_key=${process.env.APP_API_KEY}&with[0]=role`,
            { headers: { Authorization: `Bearer ${auth}` } })
            .then(response => {
                console.log(response.data);
                profile = response.data.data
            })
            .catch(error => {
                localStorage.clear()
                Router.push('/sign-in')
            });

        if (pathname == '/sign-in') {
            Router.push('/')
        } else {
            if (!profile) {
                localStorage.clear()
                Router.push('/sign-in')
            } else {
                await setAcl(profile.role_uuid)
                localStorage.setItem('user_uuid', profile.uuid)
                return {
                    profile: profile,
                    token: auth
                }
            }
        }
    } else {
        localStorage.clear()
        if (pathname != '/sign-in') Router.push('/sign-in')
    }
}

export const login = async (data) => {
    await localStorage.setItem('auth', data)
    let profile
    await axios.get(`/api/v1/profile?api_key=${process.env.APP_API_KEY}&with[0]=role`,
        { headers: { Authorization: `Bearer ${data}` } })
        .then(res => {
            console.log(res.data);
            profile = res.data.data
        })
        .catch(error => {
            console.log(error);
        });
    await setAcl(profile.role_uuid)
    localStorage.setItem('user_uuid', profile.uuid)
    await redirectPath()
    toast.fire({ icon: 'success', title: 'Anda berhasil masuk' })
}

export const logout = () => {
    localStorage.clear()
    Router.push('/sign-in')
    toast.fire({ icon: 'success', title: 'Anda berhasil keluar' })
}

const redirectPath = async () => {
    const path = await getPathDecission()
    if (path != null) {
        Router.push(path)
    } else {
        localStorage.clear()
    }
} 

const getPathDecission = async (spbu = null) => {
    const acl = localStorage.getItem('accessList')
    console.log(acl);
    const avaiableRoute = getAvaiableRoute(spbu)
    for (let i = 0; i < avaiableRoute.length; i++) {
        if (acl.includes(avaiableRoute[i].access)) return avaiableRoute[i].path
    }

    return null
}

const getAvaiableRoute = (spbu = null) => {
    const data = [
        {
            access: 'dashboard',
            path: '/'
        },
        {
            access: 'user-management.user.read',
            path: '/user'
        },
        {
            access: 'user-management.role.read',
            path: '/role'
        },
        {
            access: 'spbu.read',
            path: '/spbu'
        },
        {
            access: 'product.read',
            path: '/product'
        },
        {
            access: 'payment-method.read',
            path: '/payment'
        },
        {
            access: 'company.read',
            path: '/company'
        }
    ]

    if (spbu != null) {
        data.concat([
            {
                access: 'spbu.manage.report',
                path: `/spbu/${spbu}/report`
            },
            {
                access: 'spbu.manage.user.read',
                path: `/spbu/${spbu}/user`
            },
            {
                access: 'spbu.manage.role.read',
                path: `/spbu/${spbu}/role`
            },
            {
                access: 'spbu.manage.shift.read',
                path: `/spbu/${spbu}/shift`
            },
            {
                access: 'spbu.manage.island.read',
                path: `/spbu/${spbu}/island`
            },
            {
                access: 'spbu.manage.setting',
                path: `/spbu/${spbu}/setting`
            }
        ])
    }

    return data;
}