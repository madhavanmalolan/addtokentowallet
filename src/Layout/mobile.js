export default function LayoutMobile(props) {
    return (
        <div 
            className="layout-mobile"
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fafafa',
                minHeight: '100vh',
            }}
        >
            <div 
                className="layout-header"
                style={{
                    backgroundColor: props.headerColor,
                    padding: '0.5rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 'calc(100% - 1rem)',
                    textAlign: 'center',
                }}
            >
                <div className="layout-header-logo">
                    <img 
                        src={props.logo} className="layout-header-logo-img" alt="logo" 
                        style={{
                            width: '8rem',
                        }}
                    />
                    <h1 className="layout-header-logo-title"
                        style={{
                            marginTop: "0.2rem",
                            marginBottom: "2rem"
                        }}
                    >{props.appName}</h1>
                </div>
            </div>
            <div className="layout-body" style={{
                width: '100%',
                padding: '1rem',

            }}>
                {props.children}
            </div>

        </div>
    )
}