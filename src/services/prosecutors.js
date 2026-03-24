import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { fallbackProsecutors } from "../data/fallbackProsecutors";

export async function fetchProsecutors() {
  try {
    const q = query(collection(db, "prosecutors"), orderBy("name"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return fallbackProsecutors;
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Unable to load Firestore prosecutors, using fallback.", error);
    return fallbackProsecutors;
  }
}
