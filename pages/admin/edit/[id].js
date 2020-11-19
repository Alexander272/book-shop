import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { useLazyQuery, useMutation } from '@apollo/client/react/hooks'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import { AuthContext } from '../../../context/AuthContext'
import { Input } from '../../../Components/Input/Input'
import { SwitchInput } from '../../../Components/SwitchInput/SwitchInput'
import { FileInput } from '../../../Components/FileInput/FileInput'
import { Textarea } from './../../../Components/Textarea/Textarea'
import { Button } from '../../../Components/Button/Button'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { Loader } from '../../../Components/Loader/Loader'
import GetBookById from '../../../graphql/query/getBookById'
import UpdateBook from '../../../graphql/mutation/updateBook'
import keys from '../../../server/keys'
import classes from '../../../styles/admin.module.scss'

export default function AdminEditById() {
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
        genre: '',
        price: 0,
    })
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [success, setSuccess] = useState('')
    const [errorUpdate, setErrorUpdate] = useState('')
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [getBookById, { loading, error, data, called }] = useLazyQuery(GetBookById)
    const [updateBook] = useMutation(UpdateBook)
    const router = useRouter()

    useEffect(() => {
        if (!error) getBookById({ variables: { id: router.query.id } })
        if (data) {
            setForm(data.getBookById)
            setImageUrl({ url: data.getBookById.previewUrl, name: data.getBookById.previewName })
        }
    }, [loading, called])

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

    const updateHandler = async event => {
        try {
            setLoadingUpdate(true)
            const res = await updateBook({
                variables: {
                    book: {
                        name: form.name,
                        availability: form.availability,
                        annotation: form.annotation,
                        publisher: form.publisher,
                        author: form.author,
                        series: form.series,
                        ISBN: form.ISBN,
                        format: form.format,
                        coverType: form.coverType,
                        weight: form.weight,
                        ageRestrictions: form.ageRestrictions,
                        translator: form.translator,
                        genre: form.genre,
                        theYearOfPublishing: +form.theYearOfPublishing,
                        numberOfPages: +form.numberOfPages,
                        circulation: +form.circulation,
                        price: +form.price,
                    },
                    id: form.id,
                },
            })
            if (image) {
                const formData = new FormData()
                formData.append('image', image)
                formData.append('bookName', form.name)
                const response = await fetch(`${keys.BASE_URL}/api/upload/update`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        authorization: `Bearer ${auth.token}`,
                    },
                })
            }
            setSuccess(res.data.updateBook)
            setTimeout(() => {
                setSuccess('')
            }, 5500)
            setLoadingUpdate(false)
        } catch (e) {
            console.log(e.message)
            setLoadingUpdate(false)
            setErrorUpdate(e.message.split(': ')[1])
            setTimeout(() => {
                setErrorUpdate('')
            }, 5500)
        }
    }

    return (
        <AdminLayout title="Edit books" active="Редактировать">
            <div className={classes.container}>
                <h1 className={classes.title}>Редактировать товар</h1>
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {errorUpdate.length > 0 && <Toasts type={'error'} message={errorUpdate} />}
                <div className={classes.form}>
                    {loadingUpdate || loading ? (
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
                            <Input
                                type="text"
                                name="genre"
                                value={form.genre}
                                placeholder="Жанр"
                                onChange={changeHandler}
                            />
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
                            <Button text="Сохранить" icon={faSave} type="primary" onClick={updateHandler} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
