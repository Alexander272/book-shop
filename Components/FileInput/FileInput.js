import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

import classes from './fileInput.module.scss'

export const FileInput = ({ name, title, onUpload, getImage, image }) => {
    const changeHandler = event => {
        const f = event.target.files[0]
        const reader = new FileReader()
        reader.onload = (function (theFile) {
            return function (e) {
                getImage({ url: e.target.result, name: theFile.name })
            }
        })(f)
        reader.readAsDataURL(f)
        onUpload(event.target.files[0])
    }

    const deleteFile = event => {
        onUpload(null)
        getImage(null)
    }

    return (
        <div className={classes.fileField}>
            <p className={classes.fileDesc}>{title}</p>

            {!image && (
                <label className={classes.fileLabel}>
                    <FontAwesomeIcon className={classes.fileIcon} icon={faFileUpload} />
                    <span className={classes.fileTitle}>Добавить изображение </span>
                    <input name={name} className={classes.fileInput} type="file" onChange={changeHandler} />
                </label>
            )}

            {image && (
                <div className={classes.imgContainer}>
                    <div className={classes.container}>
                        <img className={classes.previewImg} src={image.url} />
                        <span onClick={deleteFile} className={classes.iconContainer}>
                            <FontAwesomeIcon className={classes.icon} icon={faTrashAlt} />
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
