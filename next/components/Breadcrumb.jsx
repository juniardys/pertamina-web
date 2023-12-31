import Link from "next/link";

const Breadcrumb = (props) => {
    let data = [];
    if (props.data) data = props.data

    return (
        <div className="breadcrumb-line">
            <ul className="breadcrumb">
                <Link href="/" as="/">
                    <li><a><i className="icon-home2 position-left"></i> Dashboard</a></li>
                </Link>
                {data.map((menu, i) => {
                    if (data.length == i + 1) {
                        return (
                            <li className="active" key={i}>{menu.title}</li>
                        )
                    } else {
                        return (
                            <Link href={menu.url} as={menu.as} key={i}>
                                <li><a>{menu.title}</a></li>
                            </Link>
                        )
                    }
                })}
            </ul>

            {/* <ul className="breadcrumb-elements">
                <li><a href="#"><i className="icon-comment-discussion position-left"></i> Support</a></li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                        <i className="icon-gear position-left"></i> Settings <span className="caret"></span>
                    </a>

                    <ul className="dropdown-menu dropdown-menu-right">
                        <li><a href="#"><i className="icon-user-lock"></i> Account security</a></li>
                        <li><a href="#"><i className="icon-statistics"></i> Analytics</a></li>
                        <li><a href="#"><i className="icon-accessibility"></i> Accessibility</a></li>
                        <li className="divider"></li>
                        <li><a href="#"><i className="icon-gear"></i> All settings</a></li>
                    </ul>
                </li>
            </ul> */}
        </div>
    )
}

export default Breadcrumb;