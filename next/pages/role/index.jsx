import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Index extends Component {
    render() {
        const breadcrumb = [
            {
                title: 'Role',
                url: '/role'
            }
        ]

        return (
            <Layout title="Role Management" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">List Role<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <ul className="icons-list">
                                <li><a data-action="collapse" className=""></a></li>
                                <li><a data-action="reload"></a></li>
                                <li><a data-action="close"></a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="panel-body">
                        Example of a table with <code>striped</code> rows. Use <code>.table-striped</code> added to the base <code>.table</code> class to add zebra-striping to any table odd row within the <code>&lt;tbody&gt;</code>. This styling doesn't work in IE8 and lower as <code>:nth-child</code> CSS selector isn't supported in these browser versions. Striped table can be combined with other table styles.
						</div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Eugene</td>
                                    <td>Kopyov</td>
                                    <td>@Kopyov</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Victoria</td>
                                    <td>Baker</td>
                                    <td>@Vicky</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>James</td>
                                    <td>Alexander</td>
                                    <td>@Alex</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Franklin</td>
                                    <td>Morrison</td>
                                    <td>@Frank</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index;