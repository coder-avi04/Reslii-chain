import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  setDoc,
  getDoc
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: "Loading" | "In Transit" | "Delayed" | "Delivered";
  eta: string;
  type: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  coordinates?: { lat: number, lng: number };
}

export interface Alert {
  id: string;
  type: string;
  msg: string;
  time: string;
  severity: "low" | "medium" | "high";
  category: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  displayName: string;
}

interface AppContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  shipments: Shipment[];
  alerts: Alert[];
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync user profile
        const userDoc = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userDoc);
        
        if (!snapshot.exists()) {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: "User", // Default role
            displayName: firebaseUser.displayName || "Anonymous"
          };
          await setDoc(userDoc, {
            ...newProfile,
            createdAt: new Date().toISOString(),
            emailVerified: firebaseUser.emailVerified
          });
          setProfile(newProfile);
        } else {
          setProfile(snapshot.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setShipments([]);
      setAlerts([]);
      return;
    }

    const qShipments = query(collection(db, "shipments"), orderBy("id"));
    const unsubscribeShipments = onSnapshot(qShipments, (snapshot) => {
      setShipments(snapshot.docs.map(doc => ({ ...doc.data() } as Shipment)));
    });

    const qAlerts = query(collection(db, "alerts"), orderBy("time", "desc"));
    const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert)));
    });

    return () => {
      unsubscribeShipments();
      unsubscribeAlerts();
    };
  }, [user]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      profile, 
      shipments, 
      alerts, 
      loading,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
