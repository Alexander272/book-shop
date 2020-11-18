import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './searchInput.module.scss'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const SearchInput = () => {
    return (
        <div className={classes.field}>
            <input id="search" type="search" className={classes.input} placeholder="Поиск книг, авторов" />
            <label htmlFor="search" className={classes.label}>
                <FontAwesomeIcon icon={faSearch} className={classes.icon} />
            </label>
        </div>
    )
}
