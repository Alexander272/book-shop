import classes from './loader.module.scss'

export const Loader = ({ size }) => {
    return (
        <div className={classes.loaderContainer}>
            <div className={[classes.loader, classes[size]].join(' ')}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
    )
}
