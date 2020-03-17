import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = (props) => {
	const router = useRouter()
	let acl = []
	if (typeof window !== 'undefined') {
		acl = JSON.parse(window.localStorage.getItem('accessList'))
	}

	const datas = [
		{
			access: 'dashboard',
			type: 'menu',
			title: 'Dashboard',
			icon: 'icon-home',
			url: '/'
		},
		{
			access: 'user-management',
			type: 'dropdown',
			title: 'Manajemen Pengguna',
			icon: 'icon-users',
			url: '#',
			sub: [
				{
					access: 'user-management.user',
					title: 'Pengaturan Pengguna',
					url: '/user'
				},
				{
					access: 'user-management.role',
					title: 'Pengaturan Jabatan',
					url: '/role'
				}
			]
		},
		{
			access: 'spbu',
			type: 'menu',
			title: 'SPBU',
			icon: 'icon-library2',
			url: '/spbu'
		},
		{
			access: 'product',
			type: 'menu',
			title: 'Produk',
			icon: 'icon-box',
			url: '/product'
		},
		{
			access: 'order',
			type: 'menu',
			title: 'Pemesanan',
			icon: 'icon-transmission',
			url: '/order'
		},
		{
			access: 'payment-method',
			type: 'menu',
			title: 'Metode Pembayaran',
			icon: ' icon-coin-dollar',
			url: '/payment'
		},
		{
			access: 'company',
			type: 'menu',
			title: 'Perusahaan',
			icon: 'icon-office',
			url: '/company'
		},
	]

	const renderMenu = (menu, i) => {
		if (acl && acl.includes(menu.access)) {
			return (
				<Link href={menu.url} key={i}>
					<li className={(router.pathname == menu.url) ? 'active' : null}>
						<a>
							{menu.icon != null ? (<i className={menu.icon}></i>) : (<i className="icon-circle2"></i>)}
							<span>{menu.title}</span>
						</a>
						{menu.type == 'dropdown' ? (
							<ul>
								{menu.sub.map((sub, subi) => (
									<Link href={sub.url} key={subi}>
										<li className={(router.pathname == sub.url) ? 'active' : null}><a>{sub.title}</a></li>
									</Link>
								))}
							</ul>
						) : null}
					</li>
				</Link>
			)
		}
	}

	return (
		<div className="sidebar sidebar-main">
			<div className="sidebar-content">

				<div className="sidebar-category sidebar-category-visible">
					<div className="category-content no-padding">
						<ul className="navigation navigation-main navigation-accordion">
							<li className="navigation-header"><span>Main Menu</span> <i className="icon-menu" title="Main pages"></i></li>
							{datas.map((menu, i) => (
								renderMenu(menu, i)
							))}

						</ul>
					</div>
				</div>

			</div>
		</div>
	)
}

export default Sidebar;