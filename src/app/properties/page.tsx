"use client"
import Navbar from "../components/nav";
import PropertyCard from "../components/property_card";
import { BlackTag } from "../components/tag";
import { useEffect, useState } from "react";
import axios from "axios";
import Property, { OfferType } from "../models/property";
import { LOCATIONS, PROPERTY_TYPES } from "../lib/constants";
import Footer from "../components/footer";

export default function Page() {
    const [offerType, setOfferType] = useState<OfferType>(OfferType.All);
    const [properties, setProperties] = useState<Property[]>([]);
    const [location, setLocation] = useState<string>("option1");
    const [propertyType, setPropertyType] = useState<string>("option1");

    useEffect(() => {
        fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerType]);

    const fetchProperties = async () => {
        try {
            const res = await axios.get("/api/properties/", {
                params: {
                    location: location === "option1" ? undefined : location,
                    type: propertyType === "option1" ? undefined : propertyType,
                    offerType: offerType === OfferType.All ? undefined : offerType,
                    
                },
            });
            setProperties(res.data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocation(e.target.value);
    };

    const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyType(e.target.value);
    };

    const handleUpdate = () => {
        fetchProperties();
    };
    return (
        <>
            <Navbar />
            <div className="w-full h-10 mt-32 flex justify-center items-center">
                <span className="w-11/12 md:w-1/2">
                    <p className="text-2xl md:text-4xl font-bold text-center">Properties</p>
                </span>
            </div>
            <div className="flex w-full justify-center items-center my-10">
                <div className="flex flex-col lg:flex-row w-full lg:w-2/3 bg-slate-300 justify-around items-center rounded-lg p-2">
                    <select
                        className="w-full lg:w-1/3 h-10 mx-2 my-2 lg:my-0 border border-slate-400 rounded-lg"
                        value={location}
                        onChange={handleLocationChange}
                    >
                        <option value="option1">Location</option>
                        {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    <select
                        className="w-full lg:w-1/3 h-10 mx-2 my-2 lg:my-0 border border-slate-400 rounded-lg"
                        value={propertyType}
                        onChange={handlePropertyTypeChange}
                    >
                        <option value="option1">Property Type</option>
                        {PROPERTY_TYPES.map((ptype) => (
                            <option key={ptype} value={ptype}>{ptype}</option>
                        ))}
                    </select>
                    <button
                        className="w-full lg:w-1/3 h-10 mx-2 my-2 lg:my-0 bg-slate-700 text-white rounded-lg"
                        onClick={handleUpdate}
                    > Update
                    </button>
                </div>
            </div>
            <div className="flex w-full justify-center items-center my-2">
                <div className="flex flex-col md:flex-row w-11/12 md:w-2/3 justify-start items-center space-y-2 md:space-y-0 md:space-x-2">
                    <p className="text-lg md:text-xl">Select: </p>
                    <BlackTag offerType={OfferType.All} onClick={() => setOfferType(OfferType.All)} />
                    <BlackTag offerType={OfferType.ForLease} onClick={() => setOfferType(OfferType.ForLease)} />
                    <BlackTag offerType={OfferType.ForSale} onClick={() => setOfferType(OfferType.ForSale)} />
                    <BlackTag offerType={OfferType.ForSaleOrLease} onClick={() => setOfferType(OfferType.ForSaleOrLease)} />
                    <BlackTag offerType={OfferType.Sold} onClick={() => setOfferType(OfferType.Sold)} />
                </div>
            </div>
            <div className="flex justify-center items-center my-8">
                <div className="py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
                    {properties.map(property => (

                        
                        <PropertyCard
                            key={property.id}
                            name={property.name}
                            description={property.description}
                            address = {property.address}
                            imageUrl={property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : ''}
                            link={`/properties/${property.id}`}
                            offer={property.offer}
                            price={property.offer === "For Sale" || property.offer === "Sold" ? property.askingPrice : property.offer === "For Lease" ? property.pricePerSF : property.askingPrice + " or " + property.pricePerSF}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}
