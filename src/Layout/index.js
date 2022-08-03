import React from 'react'
import { useMediaQuery } from 'react-responsive'
import LayoutDesktop from './desktop'
import LayoutMobile from './mobile'

export default function Layout(props) {
    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    return (<>
    {isDesktop && <LayoutDesktop {...props} />}
    {isTabletOrMobile && <LayoutMobile {...props} />}
    </>)
}