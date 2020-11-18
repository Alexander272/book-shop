import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import classes from './button.module.scss'

export const Button = ({ text, type, icon = null, onClick }) => {
    return (
        <div onClick={onClick} className={[classes[type], classes.btn].join(' ')}>
            <p>
                {icon && <FontAwesomeIcon className={classes.icon} icon={icon} />} {text}
            </p>
        </div>
    )
}
