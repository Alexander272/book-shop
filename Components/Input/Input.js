import React from 'react'
import classes from './input.module.scss'

export const Input = ({ placeholder, type, value, onChange, name }) => {
    return (
        <div className={classes.field}>
            <input
                className={classes.input}
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                id={name}
                required
            />
            <label htmlFor={name} className={classes.label}>
                {placeholder}
            </label>
        </div>
    )
}
