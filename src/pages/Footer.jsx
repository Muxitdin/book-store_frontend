import { FaTelegram } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="my-0 mb-1 fixed bottom-0 left-0 right-0">
            <hr className="border-gray-500 sm:mx-auto dark:border-gray-700 lg:my-5" />
            <span className="block text-l text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a className="inline-flex items-center hover:underline gap-[0.2rem] hover:text-blue-500" href="https://t.me/nxxovm" target="_blank">Muhitdin<FaTelegram /></a>. This project was done to strengthen the coding skills.</span>
        </div>
    )
}