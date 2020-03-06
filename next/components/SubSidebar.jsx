import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SubSidebar = () => {
	const router = useRouter()

	const { spbu, company } = router.query
	let datas = []

	if (router.pathname.includes('/spbu/[spbu]')) {
		datas = [
			{
				type: 'menu',
				title: 'Laporan',
				icon: 'icon-file-text2',
				url: `/spbu/${spbu}/report`,
				path: '/spbu/[spbu]/report'
			},
			{
				type: 'menu',
				title: 'Pengguna',
				icon: 'icon-users',
				url: `/spbu/${spbu}/user`,
				path: '/spbu/[spbu]/user'
			},
			{
				type: 'menu',
				title: 'Shift',
				icon: 'icon-alarm-check',
				url: `/spbu/${spbu}/shift`,
				path: '/spbu/[spbu]/shift'
			},
			{
				type: 'menu',
				title: 'Island',
				icon: 'icon-grid-alt',
				url: `/spbu/${spbu}/island`,
				path: '/spbu/[spbu]/island'
			},
			{
				type: 'menu',
				title: 'Pengiriman',
				icon: 'icon-transmission',
				url: `/spbu/${spbu}/delivery`,
				path: '/spbu/[spbu]/delivery'
			},
			{
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
				type: 'menu',
				title: 'Dashboard',
				icon: 'icon-home',
				url: `/company/${company}`,
				path: '/spbu/[company]/'
			}
		]
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
									<Link href={menu.path} key={i} as={menu.url}>

										<li className={(router.pathname == menu.url) ? 'active' : null}>
											<a>
												{menu.icon != null ? (<i className={menu.icon}></i>) : (<i className="icon-circle2"></i>)}
												<span>{menu.title}</span>
											</a>
											{menu.type == 'dropdown' ? (
												<ul>
													{menu.sub.map((sub, subi) => (
														<Link href={sub.path} as={sub.url} key={subi}>
															<li className={(router.pathname == sub.url) ? 'active' : null}><a>{sub.title}</a></li>
														</Link>
													))}
												</ul>
											) : null}
										</li>
									</Link>
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