import React from 'react'
import classes from './toasts.module.scss'

export const Toasts = ({ type, message }) => {
    return (
        <div className={[classes.toasts, classes[type]].join(' ')}>
            <p className={classes.text}>{message}</p>
            <p className={classes.loader}></p>
        </div>
    )
}
