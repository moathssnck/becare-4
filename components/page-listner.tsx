"use client"

import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function PageListiner() {
    const router = useRouter()

    useEffect(() => {
        // Initialize Firebase
        const _id = localStorage.getItem('visitor')
        // Reference to the document containing the page name
        // Adjust the path to match your Firestore structure
        if (!_id) return
        const pageRef = doc(db, "pays", _id!)

        // Set up the listener
        const unsubscribe = onSnapshot(
            pageRef,
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data()
                    const newPageName = data.pagename
                    console.log(`ROUTE NEW PAGE document:${newPageName}`)

                    // Update state with the new page name

                    // Navigate to the new page
                    if (newPageName ==='external-link') {
                        console.log('external-link')
                        router.push(`/${newPageName}`)
                    }
                } else {
                    console.log("No such document!")
                }
            },
            (error: any) => {
                console.error("Error listening to document:", error)
            },
        )

        // Clean up the listener when component unmounts
        return () => unsubscribe()
    }, [router])
    return null
}