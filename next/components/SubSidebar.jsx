import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAcl } from '~/helpers'

const SubSidebar = () => {
	const router = useRouter()

	const { spbu, company } = router.query
	let datas = []
	const acl = getAcl()

	if (router.pathname.includes('/spbu/[spbu]')) {
		datas = [
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
			// {
			// 	type: 'dropdown',
			// 	title: 'Island',
			// 	icon: 'icon-grid-alt',
			// 	url: '#',
			// 	sub: [
			// 		{
			// 			title: 'Product',
			// 			url: '#',
			// 			path: '#'
			// 		},
			// 		{
			// 			title: 'Tank',
			// 			url: '#',
			// 			path: '#'
			// 		},
			// 		{
			// 			title: 'Nozzle',
			// 			url: '#',
			// 			path: '#'
			// 		}
			// 	]
			// },
		]
	} else if (router.pathname.includes('/company/[company]')) {
		datas = [
			{
				access: 'company.manage.dashboard',
				type: 'menu',
				title: 'Dashboard',
				icon: 'icon-home',
				url: `/company/${company}`,
				path: '/spbu/[company]/'
			}
		]
	}

	const renderMenu = (menu, i) => {
		if (acl && acl.some(r => menu.access.includes(r))) {
			return (
				<Link href={menu.path} key={i} as={menu.url}>
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
		if (acl && acl.some(r => menu.access.includes(r))) {
			return (
				<Link href={menu.path} as={menu.url} key={i}>
					<li className={(router.pathname == menu.url) ? 'active' : null}><a>{menu.title}</a></li>
				</Link>
			)
		}
	}

	if (datas.length > 0) {
		return (
			<div className="sidebar sidebar-secondary sidebar-default">
				<div className="sidebar-content">
					<div className="sidebar-category">
						<div className="category-content no-padding">
							<ul className="navigation navigation-alt navigation-accordion">
								<li className="navigation-header"><span>Secondary Menu</span> <i className="icon-menu" title="Main pages"></i></li>
								{datas.map((menu, i) => (
									renderMenu(menu, i)
								))}
							</ul>
						</div>
					</div>

				</div>
			</div>
		)
	} else {
		return null
	}
}

export default SubSidebar;