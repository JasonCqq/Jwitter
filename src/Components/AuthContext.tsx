import React, { useContext, useState } from "react";

type User = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string | null;
};

type ValueProp = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type ContextProp = {
  children: React.ReactNode;
};

export const AppContext = React.createContext({} as ValueProp); //create the context API

//function body
export default function Context({ children }: ContextProp) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = (): ValueProp => {
  return useContext(AppContext);
};

//ref, getStorage, uploadBytesResumable, getDownloadURL
//updateDoc
