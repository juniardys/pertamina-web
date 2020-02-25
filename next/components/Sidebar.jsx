import React, { Component } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {
	const router = useRouter()

	const datas = [
		{
			type: 'menu',
			title: 'Dashboard',
			icon: 'icon-home',
			url: '/'
		},
		{
			type: 'dropdown',
			title: 'Manajemen Pengguna',
			icon: 'icon-users',
			url: '#',
			sub: [
				{
					title: 'Pengaturan Pengguna',
					url: '/user'
				},
				{
					title: 'Pengaturan Jabatan',
					url: '/role'
				}
			]
		},
		{
			type: 'menu',
			title: 'SPBU',
			icon: 'icon-library2',
			url: '/spbu'
		},
		{
			type: 'menu',
			title: 'Produk',
			icon: 'icon-box',
			url: '/product'
		},
		{
			type: 'menu',
			title: 'Metode Pembayaran',
			icon: ' icon-coin-dollar',
			url: '/payment'
		},
		{
			type: 'menu',
			title: 'Perusahaan',
			icon: 'icon-office',
			url: '/company'
		},
	]

	return (
		<div className="sidebar sidebar-main">
			<div className="sidebar-content">

				<div className="sidebar-category sidebar-category-visible">
					<div className="category-content no-padding">
						<ul className="navigation navigation-main navigation-accordion">
							<li className="navigation-header"><span>Main Menu</span> <i className="icon-menu" title="Main pages"></i></li>
							{datas.map((menu, i) => (
								<Link href={menu.url} key={i}>
									<li className={(router.pathname == menu.url) ? 'active' : null }>
										<a>
											{menu.icon != null ? (<i className={menu.icon}></i>) : (<i className="icon-circle2"></i>)}
											<span>{menu.title}</span>
										</a>
										{menu.type == 'dropdown' ? (
											<ul>
												{menu.sub.map((sub, subi) => (
													<Link href={sub.url} key={subi}>
														<li className={(router.pathname == sub.url) ? 'active' : null }><a>{sub.title}</a></li>
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
}

export default Sidebar;