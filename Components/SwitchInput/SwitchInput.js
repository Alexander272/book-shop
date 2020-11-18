import classes from './switchInput.module.scss'

export const SwitchInput = ({ name, placeholderTrue, placeholderFalse, onChange, checked }) => {
    return (
        <div className={classes.container}>
            <label htmlFor={name} className={classes.switch}>
                <input
                    name={name}
                    className={classes.input}
                    id={name}
                    type="checkbox"
                    onChange={onChange}
                    checked={checked}
                />
                <div className={classes.div}>
                    <span className={classes.span} />
                </div>
            </label>
            <label htmlFor={name} className={classes.label}>
                {checked ? placeholderTrue : placeholderFalse}
            </label>
        </div>
    )
}
