import React, { useState } from 'react'
import { MainLayout } from '../Layout/MainLayout'
import { Input } from '../Components/Input/Input'
import { Textarea } from '../Components/Textarea/Textarea'
import classes from '../styles/contact.module.scss'

export default function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    return (
        <MainLayout title={'Связатся с нами'}>
            <div className="content">
                <div className="container">
                    <form className={classes.form}>
                        <h3 className={classes.title}>Связаться с нами</h3>
                        <Input
                            name="name"
                            placeholder="Ваше имя"
                            type="text"
                            value={form.name}
                            onChange={changeHandler}
                        />
                        <Input
                            name="email"
                            placeholder="Ваш email"
                            type="email"
                            value={form.email}
                            onChange={changeHandler}
                        />
                        <Input
                            name="subject"
                            placeholder="Тема сообщения"
                            type="text"
                            value={form.subject}
                            onChange={changeHandler}
                        />
                        <Textarea
                            name="message"
                            placeholder="Сообщение"
                            value={form.message}
                            onChange={changeHandler}
                        />
                        <p className={classes.btn}>Отправить</p>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
