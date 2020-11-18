import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Link from 'next/link'
import classes from './adminLink.module.scss'

export const AdminLink = ({ link, text, icon = null }) => {
    return (
        <div className={classes.container}>
            <Link href={link}>
                <a className={classes.link}>
                    {icon && <FontAwesomeIcon className={classes.icon} icon={icon} />}{' '}
                    <span className={classes.devider} /> {text}
                </a>
            </Link>
        </div>
    )
}
