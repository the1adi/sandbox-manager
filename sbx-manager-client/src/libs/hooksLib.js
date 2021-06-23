import { useState } from 'react'

export function useFormFields(initialState) {
    const [fields, setValues] = useState(initialState)

    return [
        fields,
        function (event) {
            setValues({
                ...fields,
                [event.target.id]: event.target.value,
            })
        },
    ]
}

export function refreshPage() {
    window.parent.location = window.parent.location.href
}
