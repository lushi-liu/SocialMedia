import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { registerVersion } from 'firebase/app'
import { addDoc, collection} from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import {useNavigate} from 'react-router-dom'

interface FormData {
    title: string;
    description: string;
}

export const CreateForm = () => {
    
    const navigate = useNavigate();
    const [user] = useAuthState(auth)

    const schema = yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string().required('Description is required')
    })

    const {register,handleSubmit, formState:{errors}} = useForm<FormData>({
        resolver: yupResolver(schema),
    })

    const postsRef = collection(db, 'posts')

    const onPost = async (data: any) => {
        await addDoc(postsRef, {
            title: data.title,
            description: data.description,
            userID: user?.uid,
            username: user?.displayName,
        })

        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit(onPost)}>
            <input placeholder='Title' {...register('title')} />
            <p style={{color: 'red'}}>{errors.title?.message}</p>
            <textarea placeholder='Description' {...register('description')}/>
            <p style={{color: 'red'}}>{errors.description?.message}</p>
            <input type='submit'/>
        </form>
    )
}