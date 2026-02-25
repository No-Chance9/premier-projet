"use client";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormSubmitContext } from "@/app/components/FormSubmitContext";

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [isImageHidden, setIsImageHidden] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const router = useRouter();

  const [photoProfil, setPhotoProfil] = useState<string>("/images/Union.svg");

  const { data: session } = useSession();

  const user = session?.user;
  console.log("header user", user);

  const { formSubmitFromChildren } = useFormSubmitContext();

  console.log("full data", user);
  console.log("photo profil default", photoProfil);

  useEffect(() => {
    const fetchValues = async () => {
      if (user) {
        const res = await fetch(`/api/users?email=${user?.email}`);
        const data = await res.json();

        const imageRes = await fetch(
          `/api/profilePicture/${data.profilePicture}`,
        );
        const imageData = await imageRes.json();
        console.log("imageData.path:", imageData.path);

        if (imageData && imageData.path) {
          setPhotoProfil(imageData.path);
        }
      }
    };

    fetchValues();
  }, [user]);

  // Function to handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const navigateToProfile = () => {
    if (user) {
      router.push(`/authentified/user/yourprofile?email=${user.email}`);
    }
  };

  const handlePointRouge = () => {
    setIsImageHidden(true);
  };

  // Basculer isImageHidden à false uniquement lors de modifications de formSubmitFromChildren
  useEffect(() => {
    if (formSubmitFromChildren.length > 0) {
      setIsImageHidden(false);
    }
  }, [formSubmitFromChildren]);

  useEffect(() => {
    if (formSubmitFromChildren.length > 0) {
      fetch(`/api/notifications/${user?.notification}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications: formSubmitFromChildren,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to save notifications.");
          }
          return res.json();
        })
        .then((data) => {
          // On inverse le sens du tableau
          const notificationsReverse = data.notifications.reverse();

          setNotifications(notificationsReverse); // Mettre à jour les notifications à partir de la réponse
        })
        .catch((err) => console.error("Failed to save notifications:", err));
    }
  }, [formSubmitFromChildren]);

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        if (!user?.notification) {
          console.error("Notification ID is missing.");
          return;
        }

        const res = await fetch(`/api/notifications/${user.notification}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch notifications: ${res.status}`);
        }

        const data = await res.json();

        // Extraire les notifications et mettre à jour l'état
        setNotifications(data.notifications || []);
        console.log("Notifications fetched:", data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Appel de `fetchNotif` lors du démarrage ou de la modification de `formSubmitFromChildren`
    fetchNotif();
  }, [formSubmitFromChildren, user?.notification]);

  return (
    //Conteneur parent du menu deroultant
    <Disclosure
      as="nav"
      className="border border-transparent border-l-slate-50 bg-white"
    >
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="relative flex w-full max-w-xs items-center">
            {/* //SearchBar non utilise pour le moment */}
            {/* <input
                            type="text"
                            placeholder="Search or type a command"
                            className="block w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        /> */}
          </div>

          {/* Right Side (Icons and Dropdowns) */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Button de parametre Settings non utilise pour le moment */}
            {/* <button
                            type="button"
                            className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <Cog6ToothIcon aria-hidden="true" className="h-6 w-6" />
                        </button> */}

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  handlePointRouge();
                }}
                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
                <Image
                  src="/images/pointRouge.svg"
                  alt=""
                  width={12}
                  height={12}
                  className={`absolute left-1 top-0 ${isImageHidden ? "hidden" : ""}`}
                />
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <ul className="max-h-48 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="block border-b-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Vous avez ajouté un nouveau produit{" "}
                          <strong>"{notification}"</strong>
                        </li>
                      ))
                    ) : (
                      <div className="block px-4 py-2 text-sm text-gray-700">
                        No notifications
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Menu deroulant */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                  <Image
                    alt=""
                    src={photoProfil}
                    width={30}
                    height={30}
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <MenuItem>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-100"
                    onClick={navigateToProfile}
                  >
                    Your Profile
                  </button>
                </MenuItem>
                {/* <MenuItem>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                        Settings
                                    </a>
                                </MenuItem> */}
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
