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
  getDoc,
  updateDoc
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

export interface SupportInquiry {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  status: "Open" | "Pending" | "Resolved";
  timestamp: string;
  shipmentId?: string;
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
  inquiries: SupportInquiry[];
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
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Sync user profile
          const userDoc = doc(db, "users", firebaseUser.uid);
          const snapshot = await getDoc(userDoc);
          
          const ownerEmail = "avishekjain0111@gmail.com";
          const isOwnerEmail = firebaseUser.email?.toLowerCase() === ownerEmail.toLowerCase();

          if (!snapshot.exists()) {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: isOwnerEmail ? "Admin" : "Manager",
              displayName: firebaseUser.displayName || "Anonymous"
            };
            await setDoc(userDoc, {
              ...newProfile,
              createdAt: new Date().toISOString(),
              emailVerified: firebaseUser.emailVerified
            });
            setProfile(newProfile);
          } else {
            const data = snapshot.data() as UserProfile;
            // Force owner to Admin if they are currently a User or Manager
            if (isOwnerEmail && data.role !== "Admin") {
              await updateDoc(userDoc, { role: "Admin" });
              setProfile({ ...data, role: "Admin" });
            } else {
              setProfile(data);
            }
          }
        } catch (error) {
          console.error("Profile Sync Error:", error);
          // Fallback profile if Firestore is restricted
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: "User",
            displayName: firebaseUser.displayName || "Anonymous"
          });
        }
      } else {
        setProfile(null);
      }
      // Always clear loading after auth/profile check completes
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || loading || !profile) {
      setShipments([]);
      setAlerts([]);
      setInquiries([]);
      return;
    }

    const isPrivileged = profile.role === "Admin" || profile.role === "Manager";

    const qShipments = query(collection(db, "shipments"), orderBy("id"));
    const unsubscribeShipments = onSnapshot(qShipments, (snapshot) => {
      setShipments(snapshot.docs.map(doc => ({ ...doc.data() } as Shipment)));
    }, (err) => {
      if (err.code !== 'permission-denied') console.error("Shipments listener error:", err);
    });

    const qAlerts = query(collection(db, "alerts"), orderBy("time", "desc"));
    const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert)));
    }, (err) => {
      if (err.code !== 'permission-denied') console.error("Alerts listener error:", err);
    });

    let unsubscribeInquiries = () => {};
    if (isPrivileged) {
      const qInquiries = query(collection(db, "inquiries"), orderBy("timestamp", "desc"));
      unsubscribeInquiries = onSnapshot(qInquiries, (snapshot) => {
        setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportInquiry)));
      }, (err) => {
        if (err.code !== 'permission-denied') console.error("Inquiries listener error:", err);
      });
    }

    return () => {
      unsubscribeShipments();
      unsubscribeAlerts();
      unsubscribeInquiries();
    };
  }, [user, loading, profile]);

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
      inquiries,
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
