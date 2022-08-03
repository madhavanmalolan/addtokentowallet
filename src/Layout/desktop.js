import GitHubButton from 'react-github-btn'
export default function LayoutDesktop(props) {
    return (
        <div 
            className="layout-desktop"
            style={{
                display: 'flex',
                flexDirection: 'row',
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
                    width: '25%',
                    textAlign: 'center',

                }}
            >
                <div className="layout-header-logo">
                    <img 
                        src={props.logo} 
                        className="layout-header-logo-img" alt="logo" 
                        style={{
                            width: '16rem',
                            marginTop: '4rem',
                        }}
                    />
                    <h1 className="layout-header-logo-title">{props.appName}</h1>
                    <p className="layout-header-logo-subtitle">{props.appSubtitle}</p>
                    <GitHubButton 
                        href={`https://github.com/${props.repo}`} data-color-scheme="no-preference: dark_dimmed; light: dark; dark: dark;" data-size="large" data-show-count="true" aria-label="Fork madhavanmalolan/addtokentowallet on GitHub"
                        style={{
                            marginTop: '1rem',
                        }}
                    >
                        View Code
                    </GitHubButton>
                </div>
            </div>
            <div 
                className="layout-body"
                style={{
                    width: '75%',
                    padding: '1rem',
                }}
            >
                {props.children}
            </div>
        </div>
    )
}