import React, { useState, useContext, useEffect } from 'react'
import { faAngleDown, faSave, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useLazyQuery } from '@apollo/client/react/hooks'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { Input } from '../../../Components/Input/Input'
import { FileInput } from '../../../Components/FileInput/FileInput'
import { Textarea } from './../../../Components/Textarea/Textarea'
import { Button } from '../../../Components/Button/Button'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { Loader } from '../../../Components/Loader/Loader'
import { SwitchInput } from '../../../Components/SwitchInput/SwitchInput'
import { AuthContext } from '../../../context/AuthContext'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import GetGenres from '../../../graphql/query/getGenres'
import CreateNewBook from '../../../graphql/mutation/createNewBook'
import keys from '../../../server/keys'
import classes from '../../../styles/admin.module.scss'

export default function AdminAdd() {
    const [form, setForm] = useState({
        name: '',
        availability: true,
        annotation: '',
        publisher: '',
        author: '',
        series: '',
        theYearOfPublishing: '',
        ISBN: '',
        numberOfPages: 0,
        format: '',
        coverType: '',
        circulation: 0,
        weight: '',
        ageRestrictions: '',
        translator: '',
        genre: [],
        price: 0,
    })
    const [selectGenres, setSelectGenres] = useState([])
    const [genres, setGenres] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [getGenres, { data }] = useLazyQuery(GetGenres)
    const [createNewBook] = useMutation(CreateNewBook)

    useEffect(() => {
        if (!data) getGenres()
        if (data) {
            setGenres(data.getGenres)
        }
    }, [data])

    const auth = useContext(AuthContext)
    if (auth.role === 'user' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const changeHandler = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        })
    }
    const cwitchHandler = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.checked,
        })
    }

    const uploadHandler = file => {
        if (file) setImage(file)
        else setImage(null)
    }
    const getImage = data => {
        if (data) setImageUrl(data)
        else setImageUrl(null)
    }

    const openHandler = () => {
        setIsOpen(prev => !prev)
    }
    const addHandler = () => {
        setIsAdd(prev => !prev)
    }

    const changeGenreHandler = event => {
        setIsOpen(false)
        setSelectGenres(prev => prev.concat([{ id: event.target.dataset.id, name: event.target.dataset.name }]))
        setForm(prev => ({ ...prev, genre: prev.genre.concat([event.target.dataset.id]) }))
        setIsAdd(false)
    }
    const removeGenreHandler = event => {
        setSelectGenres(prev => prev.filter(g => g.id !== event.target.dataset.id))
        setForm(prev => ({ ...prev, genre: prev.genre.filter(g => g !== event.target.dataset.id) }))
    }

    const saveHandler = async event => {
        try {
            setLoading(true)
            const res = await createNewBook({
                variables: {
                    book: {
                        ...form,
                        theYearOfPublishing: +form.theYearOfPublishing,
                        numberOfPages: +form.numberOfPages,
                        circulation: +form.circulation,
                        price: +form.price,
                    },
                },
            })
            const formData = new FormData()
            formData.append('image', image)
            formData.append('bookName', form.name)
            const response = await fetch(`${keys.BASE_URL}/api/upload/add`, {
                method: 'POST',
                body: formData,
                headers: {
                    authorization: `Bearer ${auth.token}`,
                },
            })
            setSuccess(res.data.createNewBook)
            setTimeout(() => {
                setSuccess('')
            }, 5500)
            setForm({
                name: '',
                availability: true,
                annotation: '',
                publisher: '',
                author: '',
                series: '',
                theYearOfPublishing: '',
                ISBN: '',
                numberOfPages: 0,
                format: '',
                coverType: '',
                circulation: 0,
                weight: '',
                ageRestrictions: '',
                translator: '',
                genre: [],
                price: 0,
            })
            setSelectGenres([])
            setImage(null)
            setImageUrl(null)
            setLoading(false)
        } catch (e) {
            console.log(e.message)
            setLoading(false)
            setError(e.message.split(': ')[1])
            setTimeout(() => {
                setError('')
            }, 5500)
        }
    }

    return (
        <AdminLayout title="Add books" active="Добавить">
            <div className={classes.container}>
                <h1 className={classes.title}>Добавить товар</h1>
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {error.length > 0 && <Toasts type={'error'} message={error} />}
                <div className={classes.form}>
                    {loading ? (
                        <div className={classes.loader}>
                            <Loader size={'md'} />
                        </div>
                    ) : (
                        <>
                            <Input
                                type="text"
                                name="name"
                                value={form.name}
                                placeholder="Название"
                                onChange={changeHandler}
                            />
                            <SwitchInput
                                name="availability"
                                checked={form.availability}
                                placeholderTrue="Есть в наличии"
                                placeholderFalse="Нет в наличии"
                                onChange={cwitchHandler}
                            />
                            <FileInput
                                name="image"
                                title="Изображение книги"
                                folderName="books"
                                onUpload={uploadHandler}
                                getImage={getImage}
                                image={imageUrl}
                            />
                            <Textarea
                                name="annotation"
                                placeholder="Аннотация"
                                value={form.annotation}
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="publisher"
                                value={form.publisher}
                                placeholder="Издательство"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="author"
                                value={form.author}
                                placeholder="Автор"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="series"
                                value={form.series}
                                placeholder="Серия"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="theYearOfPublishing"
                                value={form.theYearOfPublishing}
                                placeholder="Год издания"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="ISBN"
                                value={form.ISBN}
                                placeholder="ISBN"
                                onChange={changeHandler}
                            />
                            <Input
                                type="number"
                                name="numberOfPages"
                                value={form.numberOfPages}
                                placeholder="Кол-во страниц"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="format"
                                value={form.format}
                                placeholder="Формат"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="coverType"
                                value={form.coverType}
                                placeholder="Тип обложки"
                                onChange={changeHandler}
                            />
                            <Input
                                type="number"
                                name="circulation"
                                value={form.circulation}
                                placeholder="Тираж"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="weight"
                                value={form.weight}
                                placeholder="Вес, г"
                                onChange={changeHandler}
                            />
                            <Input
                                type="text"
                                name="ageRestrictions"
                                value={form.ageRestrictions}
                                placeholder="Возрастные ограничения"
                                onChange={changeHandler}
                            />
                            <p className={classes.listTitle}>Жанр</p>
                            {selectGenres.length > 0 && (
                                <div className={classes.genreContainer}>
                                    {selectGenres.map(genre => (
                                        <p className={classes.genre} key={genre.id}>
                                            <span>{genre.name}</span>
                                            <span
                                                className={classes.genreIcon}
                                                data-id={genre.id}
                                                onClick={removeGenreHandler}
                                            >
                                                <FontAwesomeIcon className={classes.iconNoEvents} icon={faTimes} />
                                            </span>
                                        </p>
                                    ))}
                                </div>
                            )}
                            {!isAdd ? (
                                <Button text="Добавть жанр" type="primary" icon={faPlus} onClick={addHandler} />
                            ) : (
                                genres.length > 0 && (
                                    <div className={classes.list}>
                                        <p onClick={openHandler} className={classes.currentItem}>
                                            {genres[0].name}
                                            <FontAwesomeIcon
                                                className={[classes.listIcon, isOpen ? classes.rotate : null].join(' ')}
                                                icon={faAngleDown}
                                            />
                                        </p>
                                        <div
                                            className={[classes.listVariable, !isOpen ? classes.hidden : null].join(
                                                ' ',
                                            )}
                                        >
                                            {genres.map(g => {
                                                return (
                                                    <p
                                                        key={g.id}
                                                        data-id={g.id}
                                                        data-name={g.name}
                                                        onClick={changeGenreHandler}
                                                        className={classes.item}
                                                    >
                                                        {g.name}
                                                    </p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            )}
                            <div className={classes.genreContainer}></div>
                            <Input
                                type="text"
                                name="translator"
                                value={form.translator}
                                placeholder="Переводчик (необязательно)"
                                onChange={changeHandler}
                            />
                            <Input
                                type="number"
                                name="price"
                                value={form.price}
                                placeholder="Цена книги"
                                onChange={changeHandler}
                            />
                            <Button text="Сохранить" icon={faSave} type="primary" onClick={saveHandler} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
