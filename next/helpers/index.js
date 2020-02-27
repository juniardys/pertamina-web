import Router from 'next/router'
import Swal from 'sweetalert2'
import axios from 'axios'

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

export const checkAuth = () => {
    const auth = localStorage.getItem('auth')
    const { pathname } = Router
    
    if (auth) {
        axios.get(`${process.env.APP_API_URL}/api/v1/profile?api_key=${process.env.APP_API_KEY}`,
        { headers: { Authorization: `Bearer ${auth}` } })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                Router.push('/')
                localStorage.clear()
                Router.push('/sign-in')
            });
        
            if (pathname == '/sign-in') Router.push('/')
    } else {
        if (pathname != '/sign-in') Router.push('/sign-in')
    }
}

export const login = (data) => {
    localStorage.setItem('auth', data)
    Router.push('/')
    toast.fire({ icon: 'success', title: 'Anda berhasil masuk' })
}

export const logout = () => {
    localStorage.clear()
    Router.push('/sign-in')
    toast.fire({ icon: 'success', title: 'Anda berhasil keluar' })
}