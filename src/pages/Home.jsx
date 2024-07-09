import axios from "axios";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice";
import BookRender from "../components/BookRender.jsx";

export default function Home() {
    const [myUrl, setMyUrl] = useState("http://localhost:3000");
    const { books, isLoading } = useSelector(state => state.book);
    const dispatch = useDispatch();

    useEffect(() => {
        const getBooksFunction = async () => {
            try {
                dispatch(bookStart());
                const { data } = await axios.get(`${myUrl}/api/books`);
                if (data.length === 0) {
                    dispatch(bookSuccess({ type: "b", data: [] }))
                }
                dispatch(bookSuccess({ type: "b", data }));
            } catch (error) {
                console.log(error);
                dispatch(bookFailure(error.message));
            }
        };

        getBooksFunction();
    }, []);

    return (
        <>
            <BookRender books={books} isLoading={isLoading}/>
        </>
    )
}