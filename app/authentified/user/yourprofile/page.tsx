'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import Image from 'next/image';
import UploadForm from '@/app/components/uploadForm';
import { useSession } from "next-auth/react";
import { setConfig } from 'next/config';


function YourProfileContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [userData, setUserData] = useState<any>({});

    const { data: session } = useSession();

    const user = session?.user;

    useEffect(() => {
        const fetchUser = async () => {
            if (email) {
                const res = await fetch(`/api/users?email=${email}`);
                const data = await res.json();
                setUserData(data);
                console.log('Get user data:', data.profilePicture);
            }
        };

        fetchUser();
    }, [email]);

    const [photoProfil, setPhotoProfil] = useState<string>('/images/Union.svg');

    useEffect(() => {
        const fetchValues = async () => {
            if (email) {
                const imageRes = await fetch(`/api/profilePicture/${userData.profilePicture
                    }`);
                const imageData = await imageRes.json();
                console.log("imageData.path:", imageData.path);

                if (imageData && imageData.path) {
                    setPhotoProfil(imageData.path);
                }
            }
        };

        fetchValues();
    }, [userData]);



    return (
        <div className="flex flex-col gap-8 h-screen items-center bg-indigo-50 max-w-full box-border">
            <div>
                {photoProfil ?
                    (<Image src={photoProfil} alt="avatar" width={191} height={191} className="rounded-full mt-4 max-w-full h-auto " />)
                    :
                    (<Image src='/images/Union.svg' alt="avatar" width={191} height={191} className="rounded-full max-w-full h-auto" />)}
            </div>
            <div>
                <UploadForm />
            </div>
            {userData ? (
                <div className="bg-white shadow-md mb-4 rounded-lg p-8 max-w-lg w-full ">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{userData.name}'s Profile</h1>
                    <div className="text-sm text-gray-600 space-y-3">
                        <div>
                            <Image
                                alt=""
                                src={photoProfil}
                                width={30} height={30}
                                className="h-8 w-8 rounded-full"
                            />
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Email:</span> {userData.email}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Name:</span> {userData.name}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Surname:</span> {userData.surname}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Created At:</span> {new Date(userData.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Role:</span> {userData.role}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="text-gray-700">Loading...</div>
            )}
        </div>
    );
}

export default function YourProfile() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <YourProfileContent />
        </Suspense>
    );
}
