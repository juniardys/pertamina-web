import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { checkAcl } from '~/helpers'

const Sidebar = (props) => {
	const router = useRouter()
	let datas = []
	let spbu = null
	let notOnlyManageSPBU = true
	if (typeof window !== 'undefined') {
		spbu = window.localStorage.getItem('spbu_uuid')
		notOnlyManageSPBU = window.localStorage.getItem('notOnlyManageSPBU')
	}
	
	if (notOnlyManageSPBU == 'true') {
		datas = [
			{
				access: 'dashboard',
				type: 'menu',
				title: 'Dashboard',
				icon: 'icon-home',
				url: '/'
			},
			{
				access: ['user-management.user.read', 'user-management.role.read'],
				type: 'dropdown',
				title: 'Manajemen Pengguna',
				icon: 'icon-users',
				url: '#',
				sub: [
					{
						access: 'user-management.user.read',
						title: 'Pengaturan Pengguna',
						url: '/user'
					},
					{
						access: 'user-management.role.read',
						title: 'Pengaturan Jabatan',
						url: '/role'
					}
				]
			},
			{
				access: 'spbu.read',
				type: 'menu',
				title: 'SPBU',
				icon: 'icon-library2',
				url: '/spbu'
			},
			{
				access: 'product.read',
				type: 'menu',
				title: 'Produk',
				icon: 'icon-box',
				url: '/product'
			},
			{
				access: 'order.read',
				type: 'menu',
				title: 'Pemesanan',
				icon: 'icon-transmission',
				url: '/order'
			},
			{
				access: 'payment-method.read',
				type: 'menu',
				title: 'Metode Pembayaran',
				icon: ' icon-coin-dollar',
				url: '/payment'
			},
			{
				access: 'company.read',
				type: 'menu',
				title: 'Perusahaan',
				icon: 'icon-office',
				url: '/company'
			},
		]
	} else {
		// Menu For SPBU
		datas = [
			{
				access: 'product.read',
				type: 'menu',
				title: 'Produk',
				icon: 'icon-box',
				url: '/product'
			},
			{
				access: 'spbu.manage.report',
				type: 'menu',
				title: 'Laporan',
				icon: 'icon-file-text2',
				url: `/spbu/${spbu}/report`,
				path: '/spbu/[spbu]/report'
			},
			{
				access: 'spbu.manage.user.read',
				type: 'menu',
				title: 'Pengguna',
				icon: 'icon-users',
				url: `/spbu/${spbu}/user`,
				path: '/spbu/[spbu]/user'
			},
			{
				access: 'spbu.manage.shift.read',
				type: 'menu',
				title: 'Shift',
				icon: 'icon-alarm-check',
				url: `/spbu/${spbu}/shift`,
				path: '/spbu/[spbu]/shift'
			},
			{
				access: 'spbu.manage.island.read',
				type: 'menu',
				title: 'Island',
				icon: 'icon-grid-alt',
				url: `/spbu/${spbu}/island`,
				path: '/spbu/[spbu]/island'
			},
			{
				access: 'spbu.manage.feeder-tank.read',
				type: 'menu',
				title: 'Feeder Tank',
				icon: 'icon-inbox',
				url: `/spbu/${spbu}/feeder-tank`,
				path: '/spbu/[spbu]/feeder-tank'
			},
			{
				access: 'spbu.manage.losis.read',
				type: 'menu',
				title: 'Losis',
				icon: 'icon-balance',
				url: `/spbu/${spbu}/losis`,
				path: '/spbu/[spbu]/losis'
			},
			{
				access: 'spbu.manage.order.read',
				type: 'menu',
				title: 'Pemesanan',
				icon: 'icon-transmission',
				url: `/spbu/${spbu}/order`,
				path: '/spbu/[spbu]/order'
			},
			{
				access: 'spbu.manage.setting',
				type: 'menu',
				title: 'Pengaturan',
				icon: ' icon-gear',
				url: `/spbu/${spbu}/setting`,
				path: '/spbu/[spbu]/setting'
			},
		]
	}

	const renderMenu = (menu, i) => {
		if (checkAcl(menu.access)) {
			return (
				<Link href={(menu.path) ? menu.path : menu.url} key={i} as={menu.url}>
					<li className={(router.pathname == menu.url) ? 'active' : null}>
						<a>
							{menu.icon != null ? (<i className={menu.icon}></i>) : (<i className="icon-circle2"></i>)}
							<span>{menu.title}</span>
						</a>
						{menu.type == 'dropdown' ? (
							<ul>
								{menu.sub.map((sub, subi) => (
									renderSubMenu(sub, subi)
								))}
							</ul>
						) : null}
					</li>
				</Link>
			)
		}
	}

	const renderSubMenu = (menu, i) => {
		if (checkAcl(menu.access)) {
			return (
				<Link href={menu.url} key={i}>
					<li className={(router.pathname == menu.url) ? 'active' : null}><a>{menu.title}</a></li>
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