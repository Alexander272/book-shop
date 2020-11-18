import classes from './textarea.module.scss'

export const Textarea = ({ placeholder, value, onChange, name }) => {
    return (
        <div className={classes.inputField}>
            <textarea
                name={name}
                className={[classes.inputField__input, classes.inputField__textarea].join(' ')}
                value={value}
                onChange={onChange}
                id={name}
                required
            />
            <label htmlFor={name} className={classes.inputField__label}>
                {placeholder}
            </label>
        </div>
    )
}
