import Image from "next/image";
import LANight from "../assets/LANight.jpg"
import { Tag } from "./tag";
export default function PropertyCard() {
    return (
    <>
        
        <div className="relative w-[350px] h-[250px] rounded-lg bg-slate-500 mx-5">
            <div className="relative">
                <Image src={LANight} alt="LA Night" className="relative inset-0 h-full w-full object-cover rounded-lg" />
                <Tag/>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white opacity-100 shadow-xl z-0 rounded-b-lg pl-2 pt-2 text-lg">
                <p>Name of property</p>
            </div>
        </div>
    </>)
}